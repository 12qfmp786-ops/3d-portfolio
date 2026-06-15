declare module "gsap-trial/SplitText" {
    export class SplitText {
        constructor(
            target: string | Element | Element[] | string[],
            vars?: any
        );

        chars: HTMLElement[];
        words: HTMLElement[];
        lines: HTMLElement[];

        revert(): void;
    }
}
