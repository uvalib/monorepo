import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption,
} from "@microsoft/fast-components";
import { css } from "@microsoft/fast-element";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastSelect(), fastOption());