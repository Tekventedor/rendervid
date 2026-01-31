declare module 'lottie-web' {
  interface LottiePlayer {
    goToAndStop(frame: number, isFrame?: boolean): void;
    destroy(): void;
    totalFrames: number;
  }

  interface LottieAnimationConfig {
    container: HTMLElement;
    renderer: string;
    loop: boolean;
    autoplay: boolean;
    animationData?: object;
    path?: string;
  }

  const lottie: {
    loadAnimation: (params: LottieAnimationConfig) => LottiePlayer;
  };

  export default lottie;
}
