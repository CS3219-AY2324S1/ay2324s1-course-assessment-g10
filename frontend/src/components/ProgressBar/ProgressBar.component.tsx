import React, { useEffect, useState } from "react";
import {
  Flex,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Progress,
  Card,
  Th,
  TableContainer,
  Table,
  ProgressProps,
  Box,
  CardHeader,
  Heading,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Center,
  VStack,
} from "@chakra-ui/react";
import { fetchAllQuestions } from "../../api/questions";
import { Question } from "../../models/Question.model";
import { useProfile } from "../../contexts/profileContext";
import {
  diffRanges,
  mapRangeToDifficulty,
} from "../../helper/DifficultyFilterHelper";

type info = {
  name: string;
  percentage: number;
  solved: number;
  total: number;
  scheme?: string;
};

const ProgressBar = () => {
  const { solvedQuestions } = useProfile();

  const [datas, setDatas] = useState<info[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const allQuestions: Question[] = await fetchAllQuestions();

        const res: info[] = diffRanges.map((dr) => {
          const diff = dr.difficulty;
          const total =
            dr.difficulty !== "All"
              ? allQuestions.filter(
                  (qn) => mapRangeToDifficulty(qn.difficulty) === diff
                ).length
              : allQuestions.length;
          const solved =
            dr.difficulty !== "All"
              ? new Set(
                  solvedQuestions
                    .filter(
                      (qn) =>
                        qn.solved &&
                        mapRangeToDifficulty(qn.difficulty) === diff
                    )
                    .map((q) => q._id)
                ).size
              : new Set(
                  solvedQuestions.filter((qn) => qn.solved).map((q) => q._id)
                ).size;
          return {
            name: diff,
            percentage: total
              ? Math.round((solved / total) * 10000) / 100
              : 0.0,
            solved,
            total,
            scheme: dr.scheme,
          };
        });
        setDatas(res);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [solvedQuestions]);
  console.log(solvedQuestions);
  return (
    <>
      <Card>
        <CardHeader>
          <Heading size="md">Solved Problems</Heading>
        </CardHeader>
        <HStack gap={3} margin={4}>
          {datas
            .filter((d) => d.name === "All")
            .map((d) => (
              <CircularProgress
                size="200px"
                value={d.percentage}
                color="yellow.400"
                key="All"
                thickness={5}
              >
                <CircularProgressLabel fontSize="15px">
                  <Stat textShadow="md">
                    <StatLabel>Total Solved</StatLabel>
                    <StatNumber>
                      {d.solved}/{d.total}
                    </StatNumber>
                    <StatHelpText>{d.percentage}%</StatHelpText>
                  </Stat>
                </CircularProgressLabel>
              </CircularProgress>
            ))}
          <VStack width="100%" align="left" textAlign="left" gap={2}>
            {datas
              .filter((d) => d.name !== "All")
              .map((d) => (
                <HStack alignContent="center">
                  <Stat textShadow="md" size="xs">
                    <StatLabel>{d.name}</StatLabel>
                    <StatNumber>
                      {d.solved}/{d.total}
                    </StatNumber>
                  </Stat>
                  <Progress
                    size="lg"
                    width="100%"
                    value={d.percentage}
                    colorScheme={d.scheme}
                    marginLeft={4}
                  />
                </HStack>
              ))}
          </VStack>
        </HStack>
      </Card>
    </>
  );
};

export default ProgressBar;
