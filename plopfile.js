module.exports = function (plop) {
  plop.setGenerator("page", {
    description: "generate a page",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Please input page name:",
      },
    ],
    actions: (data) => {
      const name = "{{name}}";
      const actions = [
        {
          type: "add",
          path: `src/pages/${name}/index.vue`,
          templateFile: "plop-templates/page/index.hbs",
          data: {
            name: name,
          },
        },
      ];
      return actions;
    },
  });

  plop.setGenerator("component", {
    description: "generate a component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Please input page name:",
      },
    ],
    actions: (data) => {
      const name = "{{name}}";
      const actions = [
        {
          type: "add",
          path: `src/components/${name}/index.vue`,
          templateFile: "plop-templates/page/index.hbs",
          data: {
            name: name,
          },
        },
      ];
      return actions;
    },
  });
};
