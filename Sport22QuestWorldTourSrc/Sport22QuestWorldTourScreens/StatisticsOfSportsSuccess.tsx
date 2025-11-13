import { questWorldFontsOfSports } from '../questWorldFontsOfSports';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View as StatsPanel, Text as StatsLabel, Dimensions as StatsLayout } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import questWorldCountries from '../SportQuestDataTourWorld/questWorldCountries';

const { width: LAYOUT_W, height: LAYOUT_H } = StatsLayout.get('window');

type Props = {
	// no props needed
};

export default function StatisticsOfSportsSuccess({ }: Props) {
	// sizes driven by Dimensions (renamed variables)
	const verticalPadding = LAYOUT_H * 0.05;
	const subtitleFont = LAYOUT_W * 0.05;
	const horizMargin = Math.round(LAYOUT_W * 0.07);
	const barTotalWidth = Math.round(LAYOUT_W - horizMargin * 2);
	const barHeight = Math.round(LAYOUT_H * 0.06);
	const leftLabelWidth = Math.round(LAYOUT_W * 0.18);
	const innerTrackH = Math.round(barHeight * 0.4);
	const gradientHPad = Math.round(LAYOUT_W * 0.04);
	const gapSize = LAYOUT_H * 0.04;
	const percentFont = LAYOUT_W * 0.28;

	const [resultsMap, setResultsMap] = React.useState<Record<string, number>>({});

	// load results from AsyncStorage
	const loadResults = async () => {
		try {
			const raw = await AsyncStorage.getItem('quest_results');
			const obj = raw ? JSON.parse(raw) : {};
			setResultsMap(obj || {});
		} catch (e) {
			setResultsMap({});
		}
	};

	React.useEffect(() => {
		loadResults();
	}, []);

	// compute stats
	const totalCountries = Array.isArray(questWorldCountries) ? questWorldCountries.length : 0;
	const totalPossibleStars = totalCountries * 3;
	let starsEarned = 0;
	questWorldCountries.forEach((c: any) => {
		const v = resultsMap[c.countryId];
		starsEarned += (typeof v === 'number' ? Math.max(0, Math.min(3, Math.floor(v))) : 0);
	});
	const quizzesCompleted = Object.keys(resultsMap).length;
	const successPercent = totalPossibleStars > 0 ? Math.round((starsEarned / totalPossibleStars) * 100) : 0;

	// helpers for rendering bars (using aliased components)
	const renderProgressBar = (title: string, leftText: string, ratio: number, gradientColors: string[]) => {
		const clamped = Math.max(0, Math.min(1, ratio || 0));
		const trackTotalW = barTotalWidth - leftLabelWidth - gradientHPad;
		const fillWidth = Math.round(clamped * trackTotalW);

		return (
			<StatsPanel style={{ width: barTotalWidth, alignItems: 'center', marginVertical: LAYOUT_H * 0.012 }}>
				<StatsLabel style={{
					marginBottom: LAYOUT_H * 0.019,
					fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
					color: '#FFFFFF',
					fontSize: subtitleFont,
				}}>{title}</StatsLabel>

				<LinearGradient
					start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
					colors={gradientColors}
					style={{
						justifyContent: 'center',
						paddingHorizontal: gradientHPad / 2,
						height: barHeight,
						borderRadius: barHeight / 2,
						overflow: 'hidden',
						width: barTotalWidth,
					}}
				>
					<StatsPanel style={{ flexDirection: 'row', alignItems: 'center', width: barTotalWidth }}>
						{/* left label */}
						<StatsPanel style={{
							alignItems: 'flex-start',
							justifyContent: 'center',
							width: leftLabelWidth,
						}}>
							<StatsLabel style={{
								marginLeft: LAYOUT_W * 0.019,
								fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
								fontSize: subtitleFont * 0.88,
								color: '#fff',
							}}>{leftText}</StatsLabel>
						</StatsPanel>

						{/* progress track */}
						<StatsPanel style={{
							backgroundColor: 'rgba(173, 173, 173, 1)',
							overflow: 'hidden',
							justifyContent: 'center',
							borderRadius: innerTrackH / 2,
							height: innerTrackH,
							width: trackTotalW * 0.88,
						}}>
							<StatsPanel style={{
								backgroundColor: '#ffffff',
								width: fillWidth,
								height: innerTrackH,
								borderRadius: innerTrackH / 2,
							}} />
						</StatsPanel>
					</StatsPanel>
				</LinearGradient>
			</StatsPanel>
		);
	};

	return (
		<StatsPanel style={{
			paddingHorizontal: horizMargin,
			paddingBottom: verticalPadding,
            flex: 1,
			paddingTop: verticalPadding,
			alignItems: 'center',
		}}>
			{/* Stars Earned */}
			<StatsPanel style={{ width: barTotalWidth, alignItems: 'center', marginBottom: gapSize }}>
				{renderProgressBar(
					'Stars Earned',
					`${starsEarned}/${totalPossibleStars}`,
					totalPossibleStars === 0 ? 0 : (starsEarned / totalPossibleStars),
					['rgba(44,179,164,1)', 'rgba(39,128,117,1)']
				)}
			</StatsPanel>

			{/* Quizzes Completed */}
			<StatsPanel style={{ width: barTotalWidth, alignItems: 'center', marginBottom: gapSize }}>
				{renderProgressBar(
					'Quizzes Opened',
					`${quizzesCompleted}/${totalCountries}`,
					totalCountries === 0 ? 0 : (quizzesCompleted / totalCountries),
					['rgba(102,80,163,1)', 'rgba(68,49,142,1)']
				)}
			</StatsPanel>

			{/* Success Score */}
			<StatsPanel style={{ width: barTotalWidth, alignItems: 'center', marginTop: gapSize }}>
				<StatsLabel style={{
					marginBottom: LAYOUT_H * 0.02,
					fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
					fontSize: subtitleFont,
					color: '#FFFFFF',
				}}>Success Score</StatsLabel>

				<StatsLabel style={{
					textAlign: 'center',
					fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
					fontSize: percentFont,
					color: '#FFFFFF',
				}}>{`${successPercent}%`}</StatsLabel>
			</StatsPanel>
		</StatsPanel>
	);
}
