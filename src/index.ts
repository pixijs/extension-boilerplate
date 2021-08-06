// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="../global.d.ts" />

import { applyFsMixins } from './filters/FilterSystemMixin';
applyFsMixins();

/**
 * If you have only mixins, and no exports - this module can be tree-shaken away.
 * At least one export has to be used in your project, even if its just re-applying the mixin
 */
export { applyFsMixins };

