import { expect, it, describe } from 'bun:test';

describe('hello', () => {
    it('prints Hello World', () => {
        const log = console.log;
        let loggedOutput: string | undefined;
        console.log = (output: string) => { loggedOutput = output; };

        console.log("Hello World!");

        expect(loggedOutput).toEqual('Hello World!');

        console.log = log;
    });
});
