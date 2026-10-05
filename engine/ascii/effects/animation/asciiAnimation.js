export function startAsciiAnimation(frames, {
    frameDuration = 800,
    loop = true,
    onFrameChange = null
} = {}) {
    let frameIndex = 0;
    let timer = null;

    const animation = {
        get frame() {
            return frames[frameIndex];
        },

        stop() {
            clearTimeout(timer);
            timer = null;
        },

        reset() {
            animation.stop();
            frameIndex = 0;
            onFrameChange?.(animation.frame);
            play();
        }
    };

    function play() {
        timer = setTimeout(() => {
            frameIndex++;

            if (frameIndex >= frames.length) {
                if (!loop) {
                    frameIndex = frames.length - 1;
                    timer = null;
                    return;
                }

                frameIndex = 0;
            }

            onFrameChange?.(animation.frame);

            play();
        }, frameDuration);
    }

    onFrameChange?.(animation.frame);
    play();

    return animation;
}