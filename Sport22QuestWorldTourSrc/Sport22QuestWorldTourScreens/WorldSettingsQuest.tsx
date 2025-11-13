const { width: layoutWidth, height: layoutHeight } = TourLayout.get('window');
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
	Image as SportIcon,
	View as WorldTourContainer,
	Text as WTText,
	Dimensions as TourLayout,
	StatusBar as WorldStatusBar,
	TouchableOpacity as WTTouchable,
	Alert as TourAlert,
	Share as TourShare,
	ScrollView as SportScroll,
} from 'react-native';


interface TourQuestSportHomeProps {
	setNowSportPage: (screen: string) => void;
}
export default function WorldSettingsQuest({ setNowSportPage }: TourQuestSportHomeProps) {
	// Define settings metadata
	const settingsMeta = [
		{ key: 'sounds', label: 'Sounds', type: 'switch' },
		{ key: 'vibration', label: 'Vibration', type: 'switch' },
		{ key: 'notifications', label: 'Notifications', type: 'switch' },
		{ key: 'reset_progress', label: 'Reset App Progress', type: 'action' },
		{ key: 'share_app', label: 'Share Application', type: 'action' },
	];

	// State: map of key -> boolean (for switches)
	const [settings, setSettings] = useState<Record<string, boolean>>({
		sounds: true,
		vibration: true,
		notifications: true,
	});

	// Load persisted switches on mount
	useEffect(() => {
		(async () => {
			try {
				const newSettings: Record<string, boolean> = { ...settings };
				for (const item of settingsMeta) {
					if (item.type === 'switch') {
						const val = await AsyncStorage.getItem(`setting_${item.key}`);
						if (val !== null) newSettings[item.key] = val === 'true';
					}
				}
				setSettings(newSettings);
			} catch (e) {
				// ignore load errors
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Save a single setting
	const saveSetting = async (key: string, value: boolean) => {
		try {
			await AsyncStorage.setItem(`setting_${key}`, value ? 'true' : 'false');
		} catch (e) {
			// ignore save errors
		}
	};

	// Handlers (unique names)
	const toggleSetting = (key: string) => {
		const next = !settings[key];
		const updated = { ...settings, [key]: next };
		setSettings(updated);
		saveSetting(key, next);
	};

	const resetAppProgress = () => {
		TourAlert.alert('Reset Progress', 'Are you sure you want to reset app progress?', [
			{ text: 'Cancel', style: 'cancel' },
			{
				text: 'Reset',
				style: 'destructive',
				onPress: async () => {
					try {
						// Remove specific progress keys or clear all (adjust as needed)
						await AsyncStorage.removeItem('quest_results');
						// await AsyncStorage.removeItem('user_levels');
						TourAlert.alert('Done', 'App progress has been reset.');
					} catch (e) {
						TourAlert.alert('Error', 'Could not reset progress.');
					}
				},
			},
		]);
	};

	const shareAppLink = async () => {
		try {
			await TourShare.share({
				message: 'A lot of fun with the Sport 22 Quest World Tour app! Download now and join the adventure!',
			});
		} catch (e) {
			// ignore
		}
	};

	// Sizes derived from dimensions (renamed)
	const paddingTop = layoutHeight * 0.03;
	const iconSize = Math.round(layoutWidth * 0.06);
	const rowHeight = Math.round(layoutHeight * 0.09);
	const rowPaddingH = layoutWidth * 0.06;
	const labelFont = Math.round(layoutWidth * 0.05);
	const switchWidth = Math.round(layoutWidth * 0.12);
	const switchHeight = Math.round(layoutHeight * 0.03);
	const switchKnob = Math.round(switchHeight * 0.9);

	// add your image assets (adjust filenames if needed) (renamed)
	const restoreIconImage = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/restoreApp.png');
	const shareIconImage = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/sharePlsSportApp.png');

	// Render a row based on type
	const renderRow = (item: { key: string; label: string; type: string }) => {
		if (item.type === 'switch') {
			const value = !!settings[item.key];
			return (
				<WTTouchable
					key={item.key}
					activeOpacity={0.8}
					onPress={() => toggleSetting(item.key)}
					style={{
                        flexDirection: 'row',
						justifyContent: 'space-between',
						paddingHorizontal: rowPaddingH,
						width: layoutWidth,
						alignItems: 'center',
						height: rowHeight,
					}}
				>
					<WTText style={{ color: '#fff', fontWeight: '700', fontSize: labelFont }}>{item.label}</WTText>

					{/* custom switch */}
					<WorldTourContainer
						style={{
							backgroundColor: value ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.25)',
							height: switchHeight,
							borderRadius: switchHeight / 2,
							justifyContent: 'center',
							padding: 2,
							width: switchWidth,
						}}
					>
						<WorldTourContainer
							style={{
								backgroundColor: value ? '#e53935' : '#ffffff',
								height: switchKnob,
								alignSelf: value ? 'flex-end' : 'flex-start',
								borderRadius: switchKnob / 2,
								width: switchKnob,
							}}
						/>
					</WorldTourContainer>
				</WTTouchable>
			);
		} else {
			// action row - use images instead of emojis
			const onPress = item.key === 'reset_progress' ? resetAppProgress : shareAppLink;
			const actionImage = item.key === 'reset_progress' ? restoreIconImage : shareIconImage;
			return (
				<WTTouchable
					key={item.key}
					activeOpacity={1}
					onPress={onPress}
					style={{
						alignItems: 'center',
						height: rowHeight,
						justifyContent: 'space-between',
						width: layoutWidth,
						flexDirection: 'row',
						paddingHorizontal: rowPaddingH,
					}}
				>
					<WTText style={{ color: '#fff', fontWeight: '700', fontSize: labelFont }}>{item.label}</WTText>

					<SportIcon
						source={actionImage}
						style={{
							width: iconSize * 1.3,
							height: iconSize * 1.3,
							resizeMode: 'contain',
						}}
					/>
				</WTTouchable>
			);
		}
	};

	return (
		<WorldTourContainer style={{ flex: 1 }}>
			<WorldStatusBar barStyle="light-content" translucent backgroundColor="transparent" />
			{/* top gradient-like visual by overlaying two reds */}
			<WorldTourContainer
				style={{
					opacity: 0.95,
					height: layoutHeight,
					right: 0,
					top: 0,
					position: 'absolute',
					left: 0,
				}}
			/>
			<WorldTourContainer style={{
					alignItems: 'center',
					paddingTop,
					flex: 1,
				}}>
				{/* Content */}
				<SportScroll contentContainerStyle={{
						width: layoutWidth,
						paddingBottom: layoutHeight * 0.12,
						paddingTop: layoutHeight * 0.04,
					}}
					showsVerticalScrollIndicator={false}
				>
					{settingsMeta.map((s) => renderRow(s))}
				</SportScroll>
			</WorldTourContainer>
		</WorldTourContainer>
	);
}

