# The server-side application

The server side application requires MySQL server installed and a database created. Please see the `schema.sql` file for details.

## Instructions

- Make sure you have the database server and the database ready.
- Use `npm install` to install the dependencies.
    - This program only requires `mysql` module to run.
    - `eslint` module was added to test compliance with ES6 standard.
    - The `npm` commands might require superuser privilege in *nix systems.
- Give the following command inside this folder:
```bash
node index.js
```