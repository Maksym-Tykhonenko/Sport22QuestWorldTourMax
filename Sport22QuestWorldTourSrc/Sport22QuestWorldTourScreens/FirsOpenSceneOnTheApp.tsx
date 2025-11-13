import { questWorldFontsOfSports } from '../questWorldFontsOfSports';
import WorldSettingsQuest from './WorldSettingsQuest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect as useTourEffect, useState as useTourState, } from 'react';
import TourQuestSportHome from './TourQuestSportHome';
import {
	SafeAreaView as WorldSafeArea,
	TouchableWithoutFeedback as DismissArea,
	Dimensions as ScreenSize,
	TouchableOpacity as IconButton,
	Keyboard,
	View as TourMainView,
	Image as HeaderImageIcon,
	Text as HeaderTitleText,
    Platform,
} from 'react-native';
import StatisticsOfSportsSuccess from './StatisticsOfSportsSuccess';

type QuestSportsScenesBec =
	| 'First Entery Quest World Tour'
	| '22 Quest Sport Tour Settings'
	| 'World Sports Statistic Quest';


const { width: screenWidth, height: screenHeight } = ScreenSize.get('window');
const closeIcon = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/closeSportIcon.png');

const FirsOpenSceneOnTheApp: React.FC = () => {
	const [nowSportPage, setNowSportPage] = useTourState<QuestSportsScenesBec>('First Entery Quest World Tour');

	const renderSportQuizScene = () => {
		switch (nowSportPage) {
			case 'First Entery Quest World Tour':
				return <TourQuestSportHome setNowSportPage={setNowSportPage}/>;
			case '22 Quest Sport Tour Settings':
				return <WorldSettingsQuest />
			case 'World Sports Statistic Quest':
				return <StatisticsOfSportsSuccess />
			default:
				return null;
		}
	};

	return (
		<DismissArea onPress={() => Keyboard.dismiss()}>
			<TourMainView style={{
					height: screenHeight,
					backgroundColor: '#FF563C',
					flex: 1,
					width: screenWidth,
				}}
			>
				<LinearGradient style={{
						height: screenHeight,
						position: 'absolute',
                        width: screenWidth,
					}}
					colors={nowSportPage === 'First Entery Quest World Tour' ? ['#30747B', '#58D4E1'] : ['rgba(205, 27, 0, 1)', 'rgba(255, 86, 60, 1)']}
					start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
				/>
				<TourMainView style={{
					width: screenWidth,
					backgroundColor: nowSportPage === 'First Entery Quest World Tour' ? '#FF563C' : 'transparent',
				}}>
					<WorldSafeArea />
					<TourMainView style={{
						width: screenWidth,
						justifyContent: 'space-between',
						paddingHorizontal: screenWidth * 0.05,
						flexDirection: 'row',
						alignItems: 'center',
						paddingVertical: screenHeight * 0.021,
                        paddingTop: Platform.OS === 'android' ? screenHeight * 0.04 : 0,
					}}>
						<IconButton onPress={() => {
							if (nowSportPage === 'World Sports Statistic Quest') setNowSportPage('First Entery Quest World Tour');
							else setNowSportPage('World Sports Statistic Quest');
						}}>
							<HeaderImageIcon
								source={nowSportPage === 'World Sports Statistic Quest' ? closeIcon : require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/quizesStatIco.png')}
								style={{
									width: screenHeight * 0.035,
									height: screenHeight * 0.035,
									resizeMode: 'contain',
								}}
							/>
						</IconButton>

						<HeaderTitleText numberOfLines={1} adjustsFontSizeToFit style={{
							color: '#FFFFFF',
							fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
							fontSize: screenWidth * 0.059,
						}}>{nowSportPage === 'First Entery Quest World Tour' ? 'Quiz List' : nowSportPage === 'World Sports Statistic Quest' ? 'Statistics' : 'Settings'}</HeaderTitleText>

						<IconButton onPress={() => {
							if (nowSportPage === '22 Quest Sport Tour Settings') setNowSportPage('First Entery Quest World Tour');
							else setNowSportPage('22 Quest Sport Tour Settings');
						}}>
							<HeaderImageIcon
								source={nowSportPage === '22 Quest Sport Tour Settings' ? closeIcon : require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/sportSettings.png')}
								style={{
									width: screenHeight * 0.035,
									height: screenHeight * 0.035,
									resizeMode: 'contain',
								}}
							/>
						</IconButton>
					</TourMainView>
				</TourMainView>
				<WorldSafeArea />
				{renderSportQuizScene()}
			</TourMainView>
		</DismissArea>
	);
};

export default FirsOpenSceneOnTheApp;