import { WebView } from 'react-native-webview';
import { View, Dimensions } from 'react-native';

const QuestWorldTourSportAnimationComponent = () => {
  const dimensions = Dimensions.get('window');

  const questHtmlContOfWeb = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
   /* From Uiverse.io by KhaledMatalkah */ 
.loader {
  width: 100px;
  height: 100px;
  border: 8px solid #ffcc00;
  border-radius: 50%;
  border-top-color: transparent;
  position: relative;
  animation: loaderAnimation 1.5s linear infinite;
}

.loader::before,
.loader::after {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 50%;
  top: 50%;
  background-color: #ffcc00;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.loader::before {
  animation: loaderAnimationBefore 1s linear infinite;
}

.loader::after {
  animation: loaderAnimationAfter 1s linear infinite;
}

@keyframes loaderAnimation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes loaderAnimationBefore {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes loaderAnimationAfter {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
}

        </style>
    </head>
    <body>
<div class="loader"></div>
    </body>
    </html>
    `;

  return (
    <View style={{
      flex: 1,
      alignSelf: 'center',
      height: dimensions.height * 0.15,
      width: dimensions.width * 0.35,
    }}>
      <WebView
        scrollEnabled={false}
        javaScriptEnabled={true}
        mixedContentMode="compatibility"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scalesPageToFit={false}
        domStorageEnabled={true}
        source={{ html: questHtmlContOfWeb }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        startInLoadingState={false}
        allowsInlineMediaPlayback={true}
        bounces={false}
        mediaPlaybackRequiresUserAction={false}
      />
    </View>
  );
};

export default QuestWorldTourSportAnimationComponent;