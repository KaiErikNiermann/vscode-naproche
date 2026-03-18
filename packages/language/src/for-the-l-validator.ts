import type { ValidationChecks } from 'langium';
import type { ForTheLAstType } from './generated/ast.js';
import type { ForTheLServices } from './for-the-l-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ForTheLServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ForTheLValidator;
    const checks: ValidationChecks<ForTheLAstType> = {
        // Add validation checks here as we develop the grammar
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ForTheLValidator {}
