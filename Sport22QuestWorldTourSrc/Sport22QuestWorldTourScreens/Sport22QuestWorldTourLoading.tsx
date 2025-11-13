const RUNING_AT_FIRS_FLAG_STORAGE_KEY = 'tour_sport_app_first_run_flag';
const SPORT_PROF_STOR_KEY = '22_quest_sport_profile_storage_key';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect as useTourEffect } from 'react';
import QuestWorldTourSportAnimationComponent from '../Sport22QuestWorldTourComponents/QuestWorldTourSportAnimationComponent';
import { useNavigation as useTourNavigator } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
    View as TourRootView,
    Image as QuestLogoImage,
    Dimensions as QuestDimensions,
    Platform,
} from 'react-native';

const Sport22QuestWorldTourLoading: React.FC = () => {
    const { width: windowWidth, height: windowHeight } = QuestDimensions.get('window');
    const tourNavigator = useTourNavigator();

    useTourEffect(() => {
        let shouldShowOnboarding = false;
        // setTimeout(() => {
        //     loadApp22SportQuest();
        // }, 1000); // ensure minimum display time
        const initializeLoadingSequence = async () => {
            try {
                const [firstRunValue, profileMoodValue] = await Promise.all([
                    AsyncStorage.getItem(RUNING_AT_FIRS_FLAG_STORAGE_KEY),
                    AsyncStorage.getItem(SPORT_PROF_STOR_KEY),
                ]);

                if (!firstRunValue && !profileMoodValue) {
                    shouldShowOnboarding = true;
                    await AsyncStorage.setItem(RUNING_AT_FIRS_FLAG_STORAGE_KEY, 'true');
                }
            } catch (err) {
                if (__DEV__) console.warn('Sport22QuestWorldTourLoading:init', err);
            }

            setTimeout(() => {
                tourNavigator.replace(
                    shouldShowOnboarding
                        ? 'Sport22QuestWorldTourOnboarding'
                        : 'FirsOpenSceneOnTheApp'
                );
            }, 5000);

        };

        initializeLoadingSequence();
    }, [tourNavigator, windowWidth]);

    return (
        <TourRootView
            style={{
                flex: 1,
                height: windowHeight,
                alignItems: 'center',
                width: windowWidth,
                justifyContent: 'center',
            }}
        >
            <LinearGradient
                colors={['#30747B', '#58D4E1']}
                style={{
                    height: windowHeight,
                    position: 'absolute',
                    width: windowWidth,
                }}
                end={{ x: 0.5, y: 0 }}
                start={{ x: 0.5, y: 1 }}
            />

            <QuestLogoImage
                source={Platform.OS === 'android' 
                    ? require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/888SportsLogo.png')
                    : require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/22SportsLogo.png')}
                style={{
                    resizeMode: 'contain',
                    width: windowWidth * 0.91,
                    height: windowWidth * 0.91,
                }}
            />

            <TourRootView style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: windowHeight * 0.07,
                marginLeft: windowWidth * 0.0,
            }}>
                <QuestWorldTourSportAnimationComponent />
            </TourRootView>
        </TourRootView>
    );
};
export default Sport22QuestWorldTourLoading;