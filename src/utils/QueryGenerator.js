const QueryGenerator = {
    generateMutationObject: (mutation) => {
        const elem = mutation.split(/[(,):]+/);

        const mutationName = elem.shift();
        const resultModelName = elem.pop().trim();

        let paramArray = [];
        for (var i = 0; i < elem.length; i += 2) {
            const paramName = elem[i].trim();
            const paramType = elem[i + 1].trim();

            paramArray.push(`$${paramName}: ${paramType}`);
        }

        return {
            name: mutationName,
            header: `${mutationName}(${paramArray.join(', ')})`,
        };
    },

    generateCreateMutation: (columns, createMutationObject) => {
        if (!createMutationObject) {
            return '';
        }

        return `
            mutation ${createMutationObject.header}{
                ${createMutationObject.name}(
                    ${columns
                        .filter((column) => column.required)
                        .map((column) => {
                            const key = column.name;
                            return `${key}: $${key}`;
                        })
                        .join(', ')}
                ) {
                    ${columns
                        .map((column) => {
                            // if (column.show) {
                            return column.name;
                            // }
                        })
                        .join('\n')}
                }
            }
        `;
    },

    generateReadItemsQuery: (columns, readItemsQueryName, offset, limit) => {
        return `
            query {
                ${readItemsQueryName}(
                    offset: ${offset},
                    limit: ${limit}
                ) {
                    count
                    rows {
                        ${columns
                            .map((column) => {
                                // if (column.show) {
                                return column.name;
                                // }
                            })
                            .join('\n')}
                    }
                }
            }
        `;
    },

    // function generateUpdateMutation(valueDict) {
    generateUpdateMutation: (columns, updateMutationObject) => {
        if (!updateMutationObject) {
            return '';
        }

        return `
            mutation ${updateMutationObject.header}{
                ${updateMutationObject.name}(
                    ${columns
                        .map((column) => {
                            const key = column.name;
                            return `${key}: $${key}`;
                        })
                        .join(', ')}
                ) {
                    ${columns
                        .map((column) => {
                            // if (column.show) {
                            return column.name;
                            // }
                        })
                        .join('\n')}
                }
            }
        `;
    },
};

export default QueryGenerator;
