import React from 'react';
import {
    ScrollView as WorldTourScroll,
    View as WorldTourView,
    Animated as TourAnimated,
    Text as SportText,
    Image as SportImageQuest,
    TouchableOpacity as TourTouchableBtn,
    Dimensions as TourLayout,
} from 'react-native';
import { questWorldFontsOfSports } from '../questWorldFontsOfSports';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width: SCREEN_W, height: SCREEN_H } = TourLayout.get('window');


type Props = {
    // full country object from questWorldCountries.js
    country: any;
    onClose: () => void;
    // optional: notify parent to open next quiz when score threshold reached
    onAdvance?: (countryId: string, score: number) => void;
};

// renamed default export to a unique name; props stay the same
export default function SportQuestQuizBoard({ country, onClose, onAdvance }: Props) {
    // states renamed
    const [questionIndex, setQuestionIndex] = React.useState<number>(0);
    const [chosenOption, setChosenOption] = React.useState<number | null>(null);
    const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);
    // track answers correctness per question
    const [answersCorrect, setAnswersCorrect] = React.useState<boolean[]>([]);

    // animated values per option (for shake)
    const shakeAnimRef = React.useRef<TourAnimated.Value[]>([]);

    const questions = Array.isArray(country?.quiz) ? country.quiz : [];
    const currentQ = questions[questionIndex] ?? null;

    const questionText = currentQ?.question ?? 'Question not available';
    const options: string[] = currentQ?.options ?? ['A', 'B', 'C'];
    const rightIndex: number = typeof currentQ?.correct === 'number' ? currentQ.correct : 0;

    // sizes (renamed)
    const IMAGE_H = SCREEN_H * 0.28;
    const CARD_W = SCREEN_W * 0.92;
    const CARD_H = SCREEN_H * 0.18;
    const OPTION_H = SCREEN_H * 0.04;
    const GAP = SCREEN_H * 0.02;
    const BORDER_W = Math.max(1, Math.round(SCREEN_W * 0.003));

    const THEME_COLORS = {
        accent: '#F59700',
        success: '#12D300',
        error: '#FF482C',
        cardBlue: '#3ea1e6',
        optionBg: 'rgba(67, 67, 67, 0.3)',
    };

    // finished state -> show result page
    const [isFinished, setIsFinished] = React.useState<boolean>(false);

    React.useEffect(() => {
        // init answers array when country changes
        setAnswersCorrect(new Array(questions.length).fill(false));
        setQuestionIndex(0);
        setChosenOption(null);
        setIsConfirmed(false);
        setIsFinished(false);
    }, [country?.countryId]);

    // init animated values whenever questions change
    React.useEffect(() => {
        const len = questions.length;
        shakeAnimRef.current = Array.from({ length: Math.max(len, 1) }).map(() => new TourAnimated.Value(0));
    }, [country?.countryId]);

    // renamed handler
    const submitAnswer = async () => {
        if (chosenOption === null) return;
        // mark whether current answer is correct
        const isCorrect = chosenOption === rightIndex;
        setAnswersCorrect(prev => {
            const copy = [...prev];
            copy[questionIndex] = isCorrect;
            return copy;
        });
        setIsConfirmed(true);
        // if wrong -> shake selected option
        if (!isCorrect && typeof chosenOption === 'number') {
            shakeChoice(chosenOption);
        }
    };

    // shake animation helper (renamed)
    const shakeChoice = (idx: number) => {
        const anim = shakeAnimRef.current[idx];
        if (!anim) return;
        TourAnimated.sequence([
            TourAnimated.timing(anim, { toValue: -10, duration: 50, useNativeDriver: true }),
            TourAnimated.timing(anim, { toValue: 10, duration: 100, useNativeDriver: true }),
            TourAnimated.timing(anim, { toValue: -6, duration: 80, useNativeDriver: true }),
            TourAnimated.timing(anim, { toValue: 6, duration: 60, useNativeDriver: true }),
            TourAnimated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    // persist function renamed
    const saveResult = async (countryId: string, correctCount: number) => {
        try {
            const raw = await AsyncStorage.getItem('quest_results');
            const obj = raw ? JSON.parse(raw) : {};
            // keep the best (max) score: do not overwrite a higher existing value with a lower one
            const prev = typeof obj[countryId] === 'number' ? obj[countryId] : -1;
            if (correctCount > prev) {
                obj[countryId] = correctCount;
                await AsyncStorage.setItem('quest_results', JSON.stringify(obj));
            }
        } catch (e) {
            // ignore write errors silently
        }
    };

    // next handler renamed
    const proceedNext = async () => {
        // if not last question -> advance
        if (questionIndex < questions.length - 1) {
            setQuestionIndex(questionIndex + 1);
            setChosenOption(null);
            setIsConfirmed(false);
            // reset any shakes
            shakeAnimRef.current.forEach(a => a && a.setValue(0));
        } else {
            // finalize: count correct answers
            const correctCount = answersCorrect.reduce((acc, v) => acc + (v ? 1 : 0), 0);
            // persist to AsyncStorage
            if (country?.countryId) {
                await saveResult(country.countryId, correctCount);
            }
            // show result page (do NOT auto-advance)
            setIsFinished(true);

            // notify parent to unlock next location
            if (correctCount >= 2 && typeof onAdvance === 'function' && country?.countryId) {
                try { onAdvance(country.countryId, correctCount); } catch { /* ignore */ }
            }
        }
    };

    const getOptionBgColor = (idx: number) => {
        if (!isConfirmed) {
            return chosenOption === idx ? THEME_COLORS.accent : THEME_COLORS.optionBg;
        }
        // after confirm
        if (idx === rightIndex) return THEME_COLORS.success;
        if (chosenOption === idx && chosenOption !== rightIndex) return THEME_COLORS.error;
        return THEME_COLORS.optionBg; // dim other options
    };

    // result UI helpers
    const totalCorrect = answersCorrect.reduce((acc, v) => acc + (v ? 1 : 0), 0);
    const starSrc = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/goldStar.png');

    // result images
    const trophyImg = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/result-trophy.png');
    const targetImg = require('../Sport22QuestWorldTourAssets/Sport22QuestWorldTourImages/result-target.png');

    if (isFinished) {
        // result page logic preserved (note: variable naming inverted intentionally to keep original messaging logic)
        const isTwoOrMore = totalCorrect < 2;
        const resultImage = isTwoOrMore ? targetImg : trophyImg;
        const title = isTwoOrMore ? 'Keep Pushing!' : 'Great Job!';
        const subtitle = isTwoOrMore
            ? 'Not your best round yet — but every champion starts somewhere. Learn from it and give it another shot!'
            : 'You’ve earned enough stars to unlock the next country! Your journey across the world of sports continues — ready for the next challenge?';

        return (
            <WorldTourScroll contentContainerStyle={{ alignItems: 'center', paddingTop: SCREEN_H * 0.02, paddingBottom: SCREEN_H * 0.06 }} showsVerticalScrollIndicator={false}>
                {/* big image (result-specific) */}
                <WorldTourView style={{ width: SCREEN_W, height: IMAGE_H, alignItems: 'center', justifyContent: 'center' }}>
                    <SportImageQuest source={resultImage} style={{ width: IMAGE_H * 0.78, height: IMAGE_H * 0.78, resizeMode: 'contain' }} />
                </WorldTourView>

                {/* result card */}
                <WorldTourView style={{
                    borderWidth: BORDER_W,
                    marginBottom: SCREEN_H * 0.06,
                    backgroundColor: 'rgba(62,161,230,0.95)',
                    alignItems: 'center',
                    borderColor: '#c85f5f',
                    padding: SCREEN_W * 0.06,
                    width: CARD_W,
                    borderRadius: SCREEN_H * 0.02,
                }}>
                    <SportText style={{ color: '#fff', fontSize: SCREEN_W * 0.055, fontWeight: '700', marginBottom: SCREEN_H * 0.015, textAlign: 'center' }}>{title}</SportText>
                    <SportText style={{ color: '#fff', fontSize: SCREEN_W * 0.038, textAlign: 'center', marginBottom: SCREEN_H * 0.02, fontStyle: 'italic' }}>{subtitle}</SportText>

                    {/* stars */}
                    <WorldTourView style={{ flexDirection: 'row', marginTop: SCREEN_H * 0.01 }}>
                        {[0, 1, 2].map(i => {
                            const filled = totalCorrect > i;
                            return (
                                <SportImageQuest
                                    key={i}
                                    source={starSrc}
                                    style={{
                                        marginHorizontal: SCREEN_W * 0.02,
                                        tintColor: filled ? '#E7A702' : 'rgba(0,0,0,0.5)',
                                        height: SCREEN_W * 0.085,
                                        width: SCREEN_W * 0.085,
                                    }}
                                    resizeMode="contain"
                                />
                            );
                        })}
                    </WorldTourView>
                </WorldTourView>

                {/* buttons */}
                <WorldTourView style={{ width: CARD_W, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SCREEN_W * 0.02 }}>
                    <TourTouchableBtn
                        onPress={() => {
                            // try again: reset quiz state
                            setAnswersCorrect(new Array(questions.length).fill(false));
                            setQuestionIndex(0);
                            setChosenOption(null);
                            setIsConfirmed(false);
                            setIsFinished(false);
                            // reset shakes
                            shakeAnimRef.current.forEach(a => a && a.setValue(0));
                        }}
                        activeOpacity={0.9}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: SCREEN_H * 0.07,
                            width: CARD_W * 0.44,
                            backgroundColor: '#FF563C',
                            elevation: 3,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            borderRadius: SCREEN_H * 0.035,
                        }}
                    >
                        <SportText style={{ color: '#fff', fontSize: SCREEN_W * 0.045, fontWeight: '700' }}>Try Again</SportText>
                    </TourTouchableBtn>

                    <TourTouchableBtn
                        onPress={() => {
                            onClose();
                        }}
                        activeOpacity={0.9}
                        style={{
                            elevation: 3,
                            alignItems: 'center',
                            height: SCREEN_H * 0.07,
                            shadowOpacity: 0.2,
                            backgroundColor: '#FF563C',
                            justifyContent: 'center',
                            shadowColor: '#000',
                            borderRadius: SCREEN_H * 0.035,
                            shadowOffset: { width: 0, height: 2 },
                            width: CARD_W * 0.44,
                        }}
                    >
                        <SportText style={{ color: '#fff', fontSize: SCREEN_W * 0.045, fontWeight: '700' }}>Go to Menu</SportText>
                    </TourTouchableBtn>
                </WorldTourView>

                <WorldTourView style={{ height: SCREEN_H * 0.04 }} />
            </WorldTourScroll>
        );
    }

    // default quiz UI
    return (
        <WorldTourScroll contentContainerStyle={{ alignItems: 'center', paddingTop: SCREEN_H * 0.02, paddingBottom: SCREEN_H * 0.06 }} showsVerticalScrollIndicator={false}>
            {/* top image (flag) */}
            <WorldTourView style={{ width: SCREEN_W, height: IMAGE_H, alignItems: 'center', justifyContent: 'center' }}>
                {country?.tourImageFlag ? (
                    <SportImageQuest source={country.tourImageFlag} style={{ width: IMAGE_H * 0.78, height: IMAGE_H * 0.78, resizeMode: 'contain' }} />
                ) : null}
            </WorldTourView>

            {/* question card */}
            <WorldTourView style={{
                marginBottom: GAP,
                height: CARD_H,
                backgroundColor: THEME_COLORS.cardBlue,
                width: CARD_W,
                borderWidth: BORDER_W,
                borderColor: '#c85f5f',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: SCREEN_H * 0.02,
                padding: SCREEN_W * 0.04,
            }}>
                <SportText style={{
                    fontFamily: questWorldFontsOfSports.worldRobotoItalic,
                    color: '#fff',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    fontSize: SCREEN_W * 0.045,
                }}>{questionText}</SportText>

                {/* dots (question position) */}
                <WorldTourView style={{ flexDirection: 'row', marginTop: SCREEN_H * 0.015 }}>
                    {questions.map((_, i) => (
                        <WorldTourView key={i} style={{
                            marginHorizontal: SCREEN_W * 0.01,
                            backgroundColor: i === questionIndex ? THEME_COLORS.accent : '#2d3f44',
                            width: SCREEN_W * 0.018,
                            borderRadius: (SCREEN_W * 0.018) / 2,
                            height: SCREEN_W * 0.018,
                        }} />
                    ))}
                </WorldTourView>
            </WorldTourView>

            {/* options */}
            <WorldTourView style={{ width: CARD_W, alignItems: 'center' }}>
                {options.map((opt, idx) => {
                    const translateX = shakeAnimRef.current[idx] || new TourAnimated.Value(0);
                    return (
                        <TourTouchableBtn
                            key={idx}
                            activeOpacity={0.9}
                            onPress={() => { if (!isConfirmed) setChosenOption(idx); }}
                            style={{ width: '88%', height: OPTION_H, marginBottom: SCREEN_H * 0.018 }}
                        >
                            <TourAnimated.View
                                style={{
                                    backgroundColor: getOptionBgColor(idx),
                                    shadowColor: '#000',
                                    flex: 1,
                                    transform: [{ translateX }],
                                    justifyContent: 'center',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.15,
                                    elevation: 2,
                                    borderRadius: OPTION_H * 0.18,
                                    alignItems: 'center',
                                }}
                            >
                                <SportText style={{
                                    color: '#fff',
                                    fontSize: SCREEN_W * 0.045,
                                    fontFamily: questWorldFontsOfSports.worldRobotoRegular,
                                }}>{opt}</SportText>
                            </TourAnimated.View>
                        </TourTouchableBtn>
                    );
                })}
            </WorldTourView>

            {/* single Confirm/Next button */}
            <WorldTourView style={{ marginTop: GAP }}>
                <TourTouchableBtn
                    onPress={() => { if (!isConfirmed) submitAnswer(); else proceedNext(); }}
                    activeOpacity={0.9}
                    style={{
                        opacity: (!isConfirmed && chosenOption === null) ? 0.5 : 1,
                        width: CARD_W * 0.44,
                        alignItems: 'center',
                        backgroundColor: THEME_COLORS.error,
                        justifyContent: 'center',
                        borderRadius: OPTION_H * 0.23,
                        height: OPTION_H * 0.9,
                    }}
                    disabled={!isConfirmed && chosenOption === null}
                >
                    <SportText style={{ color: '#fff', fontSize: SCREEN_W * 0.045, fontFamily: questWorldFontsOfSports.worldRobotoExtraBold }}>
                        {!isConfirmed ? 'Confirm' : (questionIndex < questions.length - 1 ? 'Next' : 'Finish')}
                    </SportText>
                </TourTouchableBtn>
            </WorldTourView>

            {/* spacer */}
            <WorldTourView style={{ height: SCREEN_H * 0.04 }} />
        </WorldTourScroll>
    );
}
