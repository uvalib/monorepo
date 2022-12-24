import {
    provideFASTDesignSystem,
    fastSelect,
    fastOption,
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(fastSelect(), fastOption());