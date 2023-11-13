import fs from 'fs-extra'

type Testcase = {
    stdin: string;
    stdout: string;
}

/**
 * Looks up the shared volume and retrieves the in/out files 
 * for the given qn's _id
 * 
 * @param qn__id: the question's object id as defined by mongo
 */
export async function getQnStdInOut(qn__id: string): Promise<Testcase[]> {
    const dir = `/app/question_test_cases/${qn__id}/`
    const files = await fs.readdir(dir)

    const inFiles = files.filter(file => file.endsWith('.in'));

    const testcases: Testcase[] = inFiles.map(fileName => {
        const baseName = fileName.split(".").reverse()[1] as string;

        return { stdin: baseName.concat('.in'), stdout: baseName.concat('.out') }
    })

    return testcases;
}

/**
 * Creates a batch submission for every possible testcases there are
 */
export async function createBatchSubmission(
    qn__id: string,
    language_id: number, 
    source_code: string, 
    testcases: Testcase[]) {

    const submissions = await Promise.all(testcases.map(async testcase => {

        const stdin = await fs.readFile(`/app/question_test_cases/${qn__id}/${testcase.stdin}`,'base64');
        const stdout = await fs.readFile(`/app/question_test_cases/${qn__id}/${testcase.stdout}`,'base64');
        
        return {
            language_id: language_id,
            source_code: Buffer.from(source_code).toString("base64"),
            stdin: stdin,
            expected_output: stdout
        }
    }))

    return submissions;

}