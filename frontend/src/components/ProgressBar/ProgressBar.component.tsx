import React, { useEffect, useState } from "react";
import { Flex, Text, CircularProgress, CircularProgressLabel, Progress, Card, Th, TableContainer, Table } from "@chakra-ui/react";
import { fetchAllQuestions } from "../../api/questions";
import { Question } from "../../models/Question.model";
import { useProfile } from "../../contexts/profileContext";


const ProgressBar = () => {

  const { solvedQuestions } = useProfile();

  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [totalEasy, setTotalEasy] = useState(0);
  const [totalMedium, setTotalMedium] = useState(0);
  const [totalHard, setTotalHard] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [easyPercentage, setEasyPercentage] = useState(0);
  const [mediumPercentage, setMediumPercentage] = useState(0);
  const [hardPercentage, setHardPercentage] = useState(0);
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    async function fetchAndCategorizeQuestions() {
      try {
        const allQuestions: Question[] = await fetchAllQuestions();

        // Categorize questions into easy, medium, and hard
        const easyQuestions = allQuestions.filter((question) => question.difficulty >= 0 && question.difficulty < 3.5).length;
        const mediumQuestions = allQuestions.filter((question) => question.difficulty >= 3.5 && question.difficulty < 7).length;
        const hardQuestions = allQuestions.filter((question) => question.difficulty >= 7 && question.difficulty <= 10).length;

        const userEasyQuestions = solvedQuestions.filter((question) => question.difficulty >= 0 && question.difficulty < 3.5).length;
        const userMediumQuestions = solvedQuestions.filter((question) => question.difficulty >= 3.5 && question.difficulty < 7).length;
        const userHardQuestions = solvedQuestions.filter((question) => question.difficulty >= 7 && question.difficulty <= 10).length;

        setTotalEasy(easyQuestions);
        setTotalMedium(mediumQuestions);
        setTotalHard(hardQuestions);
        setTotalQuestions(easyQuestions + mediumQuestions + hardQuestions);
        setEasyCount(userEasyQuestions);
        setMediumCount(userMediumQuestions);
        setHardCount(userHardQuestions);
        setTotalSolved(userEasyQuestions + userMediumQuestions + userHardQuestions);

        // Calculate percentages here
        const easyPercentage = (userEasyQuestions / easyQuestions) * 100;
        const mediumPercentage = (userMediumQuestions / mediumQuestions) * 100;
        const hardPercentage = (userHardQuestions / hardQuestions) * 100;
        const totalPercentage = (totalSolved / totalQuestions) * 100;

        // Set state for percentages
        setEasyPercentage(easyPercentage);
        setMediumPercentage(mediumPercentage);
        setHardPercentage(hardPercentage);
        setTotalPercentage(totalPercentage);

        // Hard coded values for testing
        // setTotalEasy(10);
        // setTotalMedium(10);
        // setTotalHard(10);
        // setTotalQuestions(30);
        // setEasyCount(8);
        // setMediumCount(7);
        // setHardCount(3);
        // setTotalSolved(18);
        // setEasyPercentage(80);
        // setMediumPercentage(70);
        // setHardPercentage(30);
        // setTotalPercentage(60);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAndCategorizeQuestions();
  }, [solvedQuestions]);

  return (
    <>
      <TableContainer width="100%">
        <Table
          variant="striped"
          backgroundColor={"white"}
          size="md"
          boxShadow="md"
          transition="box-shadow 0.2s"
          _hover={{
            boxShadow: "xl",
          }}
          width="100%"
          sx={{ tableLayout: "fixed" }}
        >

          <Th colSpan={4}>
            Solved Problems
          </Th>
        </Table>
      </TableContainer>
      <Card>
        <Flex direction="column" p={10}>
          <Flex width="100%" direction="row" align="center">
            <CircularProgress size="180px" value={totalPercentage} color="yellow.400">
              <CircularProgressLabel fontSize="18px">{totalSolved} solved</CircularProgressLabel>
            </CircularProgress>
            <Flex width="100%" direction="column" align="left" textAlign="left" ml={6}>
              <Flex justify="space between" align="center" mb={2}>
                <Text fontSize="sm">Easy</Text>
                <Text fontSize="sm" color="gray.500">
                  {easyCount}/{totalEasy}
                </Text>
              </Flex>
              <Progress value={easyPercentage} colorScheme="green" mb={2} />
              <Flex justify="space between" align="center" mb={2}>
                <Text fontSize="sm">Medium</Text>
                <Text fontSize="sm" color="gray.500">
                  {mediumCount}/{totalMedium}
                </Text>
              </Flex>
              <Progress value={mediumPercentage} colorScheme="yellow" mb={2} />
              <Flex justify="space between" align="center" mb={2}>
                <Text fontSize="sm">Hard</Text>
                <Text fontSize="sm" color="gray.500">
                  {hardCount}/{totalHard}
                </Text>
              </Flex>
              <Progress value={hardPercentage} colorScheme="red" mb={2} />
            </Flex>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default ProgressBar;
