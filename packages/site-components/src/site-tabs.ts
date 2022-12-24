import {
    provideFASTDesignSystem,
    fastTab,
    fastTabPanel,
    fastTabs
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastTab(),
        fastTabPanel(),
        fastTabs()
    );