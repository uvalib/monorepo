import {
    provideFASTDesignSystem,
    fastDataGridCell,
    fastDataGridRow,
    fastDataGrid
} from "@microsoft/fast-components";

provideFASTDesignSystem()
    .withPrefix("site")
    .register(
        fastDataGridCell(),
        fastDataGridRow(),
        fastDataGrid()
    );