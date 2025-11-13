import { questWorldFontsOfSports } from '../questWorldFontsOfSports';
import React, { useState as useTourState, useEffect as useTourEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView as GestureScroll } from 'react-native-gesture-handler';
import QuestWorldQuiz from './QuestWorldQuiz';
const { width: stageWidth, height: stageHeight } = TourDimensions.get('window');
import questWorldCountries from '../SportQuestDataTourWorld/questWorldCountries';
import { 
	Text as LabelText,
	Image as SportFlagImage,
	TouchableOpacity as PressOverlay,
	Dimensions as TourDimensions,
	StyleSheet as MakeStyles,
	View as TourContainer,
} from 'react-native';

interface TourQuestSportHomeProps {
    setNowSportPage: (screen: string) => void;
}
export default function TourQuestSportHome({ setNowSportPage }: TourQuestSportHomeProps) {

	// unique dynamic sizes
	const ITEM_HEIGHT = stageHeight * 0.11;
	const ITEM_WIDTH = stageWidth * 0.9;
	const ITEM_PADDING = stageWidth * 0.025;
	const IMAGE_SIZE = ITEM_HEIGHT * 0.9;
	const BORDER_RADIUS = ITEM_HEIGHT * 0.18;
	const BORDER_WIDTH = Math.max(1, Math.round(stageWidth * 0.003));
	const STAR_SIZE = Math.round(ITEM_HEIGHT * 0.22);

	const styles = createStyles({
		itemHeight: ITEM_HEIGHT,
		itemWidth: ITEM_WIDTH,
		itemPadding: ITEM_PADDING,
		imageSize: IMAGE_SIZE,
		borderRadius: BORDER_RADIUS,
		borderWidth: BORDER_WIDTH,
		starSize: STAR_SIZE,
		verticalGap: stageHeight * 0.02
	});

	// local state
	const [showQuiz, setShowQuiz] = useTourState<boolean>(false);
	const [selectedCountry, setSelectedCountry] = useTourState<any>(null);

	const [unlockedIds, setUnlockedIds] = useTourState<string[]>([]);
	const [resultsMap, setResultsMap] = useTourState<Record<string, number>>({});

	// fetch unlocked results from storage
	const fetchUnlocked = async () => {
		try {
			const raw = await AsyncStorage.getItem('quest_results');
			const obj: Record<string, number> = raw ? JSON.parse(raw) : {};
			const ids = Object.keys(obj || {});
			// ensure first country is always unlocked
			if (questWorldCountries && questWorldCountries[0] && !ids.includes(questWorldCountries[0].countryId)) {
				ids.unshift(questWorldCountries[0].countryId);
			}
			setUnlockedIds(Array.from(new Set(ids)));
			setResultsMap(obj);
		} catch (e) {
			const firstId = questWorldCountries && questWorldCountries[0] ? questWorldCountries[0].countryId : '';
			setUnlockedIds(firstId ? [firstId] : []);
			setResultsMap({});
		}
	};

	// load on mount
	useTourEffect(() => {
		fetchUnlocked();
	}, []);

	// helper to check unlock (unique name)
	const checkUnlocked = (index: number, countryId?: string) => {
		if (index === 0) return true;
		if (countryId && unlockedIds.includes(countryId)) return true;
		return false;
	};

	return (
		<TourContainer style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: stageHeight * 0.03 }}>
			{showQuiz && selectedCountry ? (
				<QuestWorldQuiz
					country={selectedCountry}
					onClose={async () => {
						setShowQuiz(false);
						setSelectedCountry(null);
						await fetchUnlocked();
					}}
					onAdvance={async (countryId: string, score: number) => {
						if (score >= 2) {
							const idx = questWorldCountries.findIndex((c: any) => c.countryId === countryId);
							if (idx >= 0 && idx < questWorldCountries.length - 1) {
								const nextId = questWorldCountries[idx + 1]?.countryId;
								if (nextId) {
									try {
										const raw = await AsyncStorage.getItem('quest_results');
										const obj = raw ? JSON.parse(raw) : {};
										if (!obj[nextId]) {
											obj[nextId] = 0;
											await AsyncStorage.setItem('quest_results', JSON.stringify(obj));
										}
										await fetchUnlocked();
									} catch (e) {
										// ignore
									}
								}
							}
						}
					}}
				/>
			) : (
				<GestureScroll contentContainerStyle={{ alignItems: 'center', paddingBottom: stageHeight * 0.06 }} showsVerticalScrollIndicator={false}>
					{questWorldCountries && questWorldCountries.map((country: any, idx: number) => {
						const unlocked = checkUnlocked(idx, country?.countryId);
						return (
							<TourContainer key={country.name ?? idx} style={[styles.sportItemContainer, { marginBottom: styles.verticalGap }]}>
								{/* left image */}
								<TourContainer style={styles.leftImageWrap}>
									{country.tourImageFlag ? (
										<SportFlagImage source={country.tourImageFlag} style={styles.flagImage} resizeMode="cover" />
									) : (
										<TourContainer style={[styles.flagImage, { 
											backgroundColor: '#0b3' 
										}]} />
									)}
									{!unlocked && (
										<TourContainer style={styles.lockOverlay}>
											<SportFlagImage source={require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/lockerQuix.png')} style={{
												width: IMAGE_SIZE * 0.61,
												height: IMAGE_SIZE * 0.61,
											}} resizeMode="contain" />
										</TourContainer>
									)}
								</TourContainer>

								{/* center name */}
								<TourContainer style={styles.centerWrap}>
									<LabelText numberOfLines={1} adjustsFontSizeToFit style={styles.countryName}>{country.nameOfSportCountry}</LabelText>
								</TourContainer>

								{/* right stars */}
								<TourContainer style={styles.rightWrap}>
									{(() => {
										const cid = country?.countryId;
										const correct = cid ? (resultsMap[cid] ?? 0) : 0;
										const filledCount = Math.max(0, Math.min(3, Math.floor(correct)));
										const filledTint = filledCount === 1 ? '#CD7F32' : (filledCount === 2 ? '#C0C0C0' : (filledCount >= 3 ? '#E7A702' : '#CD7F32'));
										const starSrc = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/goldStar.png');
										return Array.from({ length: 3 }).map((_, sIdx) => {
											const filled = sIdx < filledCount;
											return (
												<SportFlagImage
													key={sIdx}
													source={starSrc}
													style={[styles.starImage, { tintColor: filled ? filledTint : 'rgba(0,0,0,0.5)' }]}
													resizeMode="contain"
												/>
											);
										});
									})()}
								</TourContainer>

								{/* Touchable: if unlocked open quiz */}
								{unlocked ? (
									<PressOverlay
										style={MakeStyles.absoluteFill}
										onPress={() => {
											setSelectedCountry(country);
											setShowQuiz(true);
										}}
									/>
								) : null}
							</TourContainer>
						);
					})}
				</GestureScroll>
			)}
		</TourContainer>
	);
}

type StylesParams = {
	borderWidth: number;
	itemWidth: number;
	verticalGap: number;
	itemPadding: number;
	imageSize: number;
	borderRadius: number;
	starSize: number;
	itemHeight: number;
};

function createStyles(p: StylesParams) {
	return MakeStyles.create({
		sportItemContainer: {
			borderWidth: p.borderWidth,
			height: p.itemHeight,
			flexDirection: 'row',
			backgroundColor: 'rgba(60, 115, 255, 0.4)',
			paddingHorizontal: p.itemPadding,
			shadowRadius: 4,
			width: p.itemWidth,
			alignItems: 'center',
			borderRadius: p.borderRadius,
			shadowColor: '#000',
			elevation: 3,
			shadowOpacity: 0.15,
			borderColor: '#c85f5f',
			shadowOffset: { width: 0, height: 2 },
		},
		leftImageWrap: {
			alignItems: 'center',
			height: p.imageSize * 0.88,
			justifyContent: 'center',
			overflow: 'hidden',
			borderRadius: p.borderRadius * 0.6,
			backgroundColor: '#fff',
			width: p.imageSize,
			marginRight: p.itemPadding,
		},
		flagImage: {
			width: p.imageSize,
			height: p.imageSize,
		},
		lockOverlay: {
			alignItems: 'center',
			left: 0, top: 0, right: 0, bottom: 0,
			justifyContent: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.75)',
			position: 'absolute',
		},
		lockEmoji: {
			fontSize: Math.round(p.imageSize * 0.45),
			color: '#ff6b35'
		},
		centerWrap: {
			flex: 1,
			justifyContent: 'center',
            alignItems: 'center'
		},
		countryName: {
            maxWidth: p.itemWidth * 0.44,
            fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
			fontSize: Math.round(p.itemWidth * 0.049),
			color: '#fff',
		},
		rightWrap: {
			width: p.itemWidth * 0.25,
			alignItems: 'flex-end',
			justifyContent: 'flex-end',
			flexDirection: 'row',
		},
		starImage: {
			marginLeft: Math.round(p.starSize * 0.15),
			height: p.starSize,
			width: p.starSize,
		},
		verticalGap: p.verticalGap
	});
}

