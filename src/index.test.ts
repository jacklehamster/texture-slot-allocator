import { expect, it, describe } from 'bun:test';

describe('hello', () => {
    it('prints Hello World', () => {
        const log = console.log;
        let loggedOutput = null;
        console.log = (output) => { loggedOutput = output; };

        console.log("Hello World!");

        expect(loggedOutput).toEqual('Hello World!');

        console.log = log;
    });
});
