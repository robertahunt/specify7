export = function(value: any, message: string) : void {
    if (!value) {
        throw new Error(message);
    }
};

