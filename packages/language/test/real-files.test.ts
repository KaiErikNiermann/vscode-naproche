import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem, type LangiumDocument } from "langium";
import { parseHelper } from "langium/test";
import type { Model } from "for-the-l-language";
import { createForTheLServices } from "for-the-l-language";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

let services: ReturnType<typeof createForTheLServices>;
let parse: ReturnType<typeof parseHelper<Model>>;

beforeAll(async () => {
    services = createForTheLServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.ForTheL);
});

const testingDir = path.resolve(__dirname, '../../../testing');

function testingFile(name: string): string {
    return readFileSync(path.resolve(testingDir, name), 'utf8');
}

function ftlTest(name: string) {
    const filePath = path.resolve(testingDir, name);
    if (!existsSync(filePath)) {
        test.skip(name, () => {});
        return;
    }
    test(name, async () => {
        const doc = await parse(testingFile(name));
        reportErrors(doc, name);
    });
}

describe('Original files', () => {
    ftlTest('preliminaries.ftl');
    ftlTest('cantor.ftl');
    ftlTest('furstenberg.ftl');
    ftlTest('hilbert-calculus.ftl');
    ftlTest('basic-arithmetic.ftl');
    ftlTest('basic-sets.ftl');
});

describe('Math examples', () => {
    ftlTest('chinese.ftl');
    ftlTest('newman.ftl');
    ftlTest('tarski.ftl');
    ftlTest('koenig.ftl');
    ftlTest('hausdorff.ftl');
    ftlTest('maximum_modulus.ftl');
    ftlTest('prime_no_square.ftl');
    ftlTest('classes.ftl');
});

describe('Language features', () => {
    ftlTest('macros.ftl');
    ftlTest('vocabulary.ftl');
});

describe('Puzzles', () => {
    ftlTest('checkerboard.ftl');
    ftlTest('dwarfs.ftl');
});

describe('Test edge cases', () => {
    ftlTest('hang.ftl');
    ftlTest('nested_existential.ftl');
    ftlTest('read_test.ftl');
});

function reportErrors(doc: LangiumDocument<Model>, filename: string) {
    const lexErrs = doc.parseResult.lexerErrors;
    const parseErrs = doc.parseResult.parserErrors;
    if (lexErrs.length > 0) {
        console.error(`\n=== ${filename}: ${lexErrs.length} LEXER ERRORS ===`);
        for (const e of lexErrs.slice(0, 5)) {
            console.error(`  L${e.line}:${e.column} - ${e.message}`);
        }
        if (lexErrs.length > 5) console.error(`  ... and ${lexErrs.length - 5} more`);
    }
    if (parseErrs.length > 0) {
        console.error(`\n=== ${filename}: ${parseErrs.length} PARSER ERRORS ===`);
        for (const e of parseErrs.slice(0, 5)) {
            console.error(`  L${e.token.startLine}:${e.token.startColumn} - ${e.message.slice(0, 200)}`);
        }
        if (parseErrs.length > 5) console.error(`  ... and ${parseErrs.length - 5} more`);
    }
    expect(lexErrs).toHaveLength(0);
    expect(parseErrs).toHaveLength(0);
}
