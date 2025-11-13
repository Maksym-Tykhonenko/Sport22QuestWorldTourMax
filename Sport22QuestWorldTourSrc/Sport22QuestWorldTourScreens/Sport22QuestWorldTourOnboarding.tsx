import LinearGradient from 'react-native-linear-gradient';
import { questWorldFontsOfSports } from '../questWorldFontsOfSports';
import swarfsWelcomeImages from '../SportQuestDataTourWorld/tourSportGreahelloQuestData'
import { useNavigation as useTourNav } from '@react-navigation/native';
import React, { useState as useTourStepState } from 'react';
import {
	Text as TourTextLabel,
	SafeAreaView as WorldTourSafeSportArea,
	useWindowDimensions as useQuestWindow,
	View as TourViewContainer,
	TouchableOpacity as NextActionTouch,
	Image as SportImageQuest,
} from 'react-native';


const Sport22QuestWorldTourOnboarding: React.FC = () => {
	const tourNavigation = useTourNav();
	const [tourStepIdx, setTourStepIdx] = useTourStepState(0);
	const { width: layoutWidth, height: layoutHeight } = useQuestWindow();
	const handleNextStepTour = () => {
		const lastStepIdx = swarfsWelcomeImages.length - 1;
		if (tourStepIdx < lastStepIdx) {
			setTourStepIdx(prev => prev + 1);
		} else {
			tourNavigation.replace?.('FirsOpenSceneOnTheApp');
		}
	};
	return (
		<TourViewContainer style={{
				flex: 1,
				width: layoutWidth,
				alignItems: 'center',
				height: layoutHeight}}
		>
			<LinearGradient
                end={{ x: 0.5, y: 0 }}
                colors={['#30747B', '#58D4E1']}
                start={{ x: 0.5, y: 1 }}
				style={{
                    position: 'absolute',
					width: layoutWidth,
					height: layoutHeight,
				}}
			/>
			<WorldTourSafeSportArea />
			<SportImageQuest style={{ width: layoutWidth, height: layoutHeight * 0.4}}
				resizeMode="cover"
				source={swarfsWelcomeImages[tourStepIdx].imageOf22Tour}
			/>

			<TourViewContainer style={{
				justifyContent: 'center',
				position: 'absolute',
				bottom: layoutHeight * 0.1,
				alignItems: 'center',
				width: layoutWidth * 0.8,
				height: layoutHeight * 0.5,
				alignSelf: 'center',
			}}>
				<TourTextLabel style={{
					textAlign: 'center',
					fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
					fontSize: layoutHeight * 0.031,
					color: '#FFFFFF',
				}}>
					{swarfsWelcomeImages[tourStepIdx].sportTitle}
				</TourTextLabel>

				<TourTextLabel style={{
					textAlign: 'center',
					fontFamily: questWorldFontsOfSports.quest22tourRobotoCondensed,
					fontSize: layoutHeight * 0.025,
					marginTop: layoutHeight * 0.025,
					color: '#FFFFFF',
				}}>
					{swarfsWelcomeImages[tourStepIdx].sportOpis}
				</TourTextLabel>
			</TourViewContainer>

			<NextActionTouch
				onPress={handleNextStepTour}
				style={{
					borderRadius: layoutHeight * 0.01,
					backgroundColor: '#FF4022',
					bottom: layoutHeight * 0.0480543,
					alignItems: 'center',
					position: 'absolute',
					justifyContent: 'center',
					width: layoutWidth * 0.35,
					height: layoutHeight * 0.05,
					alignSelf: 'center',
				}}
				activeOpacity={0.8}
			>
				<TourTextLabel style={{
                    color: '#FFFFFF',
					textAlign: 'center',
					fontSize: layoutHeight * 0.028,
					fontFamily: questWorldFontsOfSports.worldRobotoExtraBold,
				}}>
					Next
				</TourTextLabel>
			</NextActionTouch>
		</TourViewContainer>
	);
};

export default Sport22QuestWorldTourOnboarding;