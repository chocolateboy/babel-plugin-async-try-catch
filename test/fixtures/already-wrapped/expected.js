async function alreadyWrapped (filename) {
    try {
        let contents = await fs.readFileAsync(filename, 'utf8');
        console.log(contents);
    } catch (error) {
        console.error('error.printFile:', error.stack);
    }
}
