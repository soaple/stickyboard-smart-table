import ColumnUtil from './ColumnUtil';

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
                        .filter((column) => column.requiredToCreate)
                        .map((column) => {
                            let key = column.name;
                            if (column.extractor) {
                                key = column.extractor.targetParamName;
                            }
                            return `${key}: $${key}`;
                        })
                        .join(', ')}
                ) {
                    ${columns
                        .map((column) => {
                            if (column.subfields) {
                                return `${column.name} ${column.subfields}`;
                            } else {
                                return column.name;
                            }
                        })
                        .join('\n')}
                }
            }
        `;
    },

    generateReadItemsQuery: (
        columns,
        readItemsQueryName,
        offset,
        limit,
        filterOptions = [],
        orderColumn = null,
        orderMethod = null
    ) => {
        // Generate filter conditions
        let filterConditions = '';
        if (filterOptions.length > 0) {
            let filterOptionArray = filterOptions.map((filterOption) => {
                if (filterOption.filterColumnKey) {
                    return `
                        {
                            filterDataType: "${filterOption.filterDataType}"
                            filterColumnName: "${filterOption.filterColumnName}"
                            filterColumnKey: "${filterOption.filterColumnKey}"
                            filterColumnValue: "${filterOption.filterColumnValue}"
                        }
                    `;
                } else {
                    return `
                        {
                            filterDataType: "${filterOption.filterDataType}"
                            filterColumnName: "${filterOption.filterColumnName}"
                            filterColumnValue: "${filterOption.filterColumnValue}"
                        }
                    `;
                }
            });

            filterConditions = `,
                filter_options: [${filterOptionArray.join(',')}]
            `;
        }

        // Generate order condition
        let orderCondition = '';
        if (orderColumn && orderMethod) {
            orderCondition = `,
                order_column: "${orderColumn}",
                order_method: "${orderMethod}"
            `;
        }

        return `
            query {
                ${readItemsQueryName}(
                    offset: ${offset},
                    limit: ${limit}
                    ${filterConditions}
                    ${orderCondition}
                ) {
                    count
                    rows {
                        ${columns
                            .map((column) => {
                                if (column.subfields) {
                                    return `${column.name} ${column.subfields}`;
                                } else {
                                    return column.name;
                                }
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

        const targetColumns = columns.filter((column) => {
            return ColumnUtil.isScalarData(column.type) || column.extractor;
        });

        return `
            mutation ${updateMutationObject.header}{
                ${updateMutationObject.name}(
                    ${targetColumns
                        .map((column) => {
                            let key = column.name;
                            if (column.extractor) {
                                key = column.extractor.targetParamName;
                            }
                            return `${key}: $${key}`;
                        })
                        .join(', ')}
                ) {
                    ${targetColumns
                        .map((column) => {
                            if (column.subfields) {
                                return `${column.name} ${column.subfields}`;
                            } else {
                                return column.name;
                            }
                        })
                        .join('\n')}
                }
            }
        `;
    },
};

export default QueryGenerator;
