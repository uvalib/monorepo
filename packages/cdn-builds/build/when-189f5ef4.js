/**
 * A directive that enables basic conditional rendering in a template.
 * @param binding - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @public
 */
function when(binding, templateOrTemplateBinding) {
    const getTemplate = typeof templateOrTemplateBinding === "function"
        ? templateOrTemplateBinding
        : () => templateOrTemplateBinding;
    return (source, context) => binding(source, context) ? getTemplate(source, context) : null;
}

export { when as w };
