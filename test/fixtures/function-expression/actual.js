let fn = async function expression (filename) {
    let contents = await fs.readFileAsync(filename, 'utf8');
    console.log(contents);
};
