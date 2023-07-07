module.exports = function (plop) {
    // create your generators here
    plop.setGenerator('11ty-website', {
        description: 'Create a new 11ty website',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of your 11ty project?',
            },
        ],
        actions: [
            {
                type: 'add',
                path: '../{{dashCase name}}/package.json',
                templateFile: 'templates/11ty/package.json.hbs',
            },
            {
                type: 'add',
                path: '../{{dashCase name}}/.eleventy.js',
                templateFile: 'templates/11ty/.eleventy.js.hbs',
            },
            {
                type: 'add',
                path: '../{{dashCase name}}/src/index.njk',
                templateFile: 'templates/11ty/src/index.njk.hbs',
            },
            {
                type: 'add',
                path: '../{{dashCase name}}/src/_includes/layout.njk',
                templateFile: 'templates/11ty/src/_includes/layout.njk.hbs',
            },
        ],
    });
};
