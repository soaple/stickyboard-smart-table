const ColumnUtil = {
    isScalarData: (columnType) => {
        if (
            columnType === 'Int' ||
            columnType === 'Float' ||
            columnType === 'String' ||
            columnType === 'Boolean' ||
            columnType === 'ID' ||
            columnType === 'Date'
        ) {
            return true;
        }
        return false;
    },
};

export default ColumnUtil;
