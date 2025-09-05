const getMeanStd = (array: number[]) => {
    const mean = array.reduce((acc, val) => acc + val) / array.length;

    return {
        mean: mean,
        stdev: Math.sqrt(
            array
                .map((x) => Math.pow(x - mean, 2))
                .reduce((acc, val) => acc + val) / array.length,
        ),
    };
};

export default getMeanStd;
