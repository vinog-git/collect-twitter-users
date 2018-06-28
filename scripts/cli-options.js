module.exports = (callback) => {

    const q = require('../data/questions');

    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let i = 0;
    let answers = [];

    function askQuestion(ques, i) {
        i = i || 0;
        printQuestion(ques.q[i]).then(res => {
            answers.push(res);
            i++;
            if (i < ques.q.length) {
                askQuestion(ques, i);
            } else {
                if (!ques.hasOwnProperty('sub')) {
                    rl.close();
                    callback(answers);
                } else {
                    askQuestion(ques.sub[res]);
                }
            }
        });
    }

    function printQuestion(quest) {
        return new Promise(resolve => {
            rl.question(`${quest}\n> `, answer => {
                resolve(answer);
            });
        });
    }
    askQuestion(q);
}