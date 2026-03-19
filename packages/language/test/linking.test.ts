import { beforeAll, describe, expect, test } from "vitest";
import { EmptyFileSystem } from "langium";
import { parseHelper } from "langium/test";
import type { Model } from "for-the-l-language";
import { createForTheLServices } from "for-the-l-language";

let services: ReturnType<typeof createForTheLServices>;
let parse: ReturnType<typeof parseHelper<Model>>;

beforeAll(async () => {
    services = createForTheLServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.ForTheL);
});

describe('Cross-reference linking', () => {

    test('named axiom can be parsed', async () => {
        const doc = await parse(`
Axiom MyAxiom. x = x.
Lemma. x = x.
Proof.
  x = x (by MyAxiom).
Qed.
        `);
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });

    test('read directive parsed', async () => {
        const doc = await parse('[read examples/file.ftl]');
        expect(doc.parseResult.parserErrors).toHaveLength(0);
    });
});
