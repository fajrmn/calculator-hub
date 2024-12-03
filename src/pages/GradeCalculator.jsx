import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';

const GradeCalculator = () => {
  const [assignments, setAssignments] = useState([
    { name: '', grade: '', weight: '' }
  ]);
  const [finalGrade, setFinalGrade] = useState(null);
  const [error, setError] = useState(null);

  // Final Grade Planning
  const [currentGrade, setCurrentGrade] = useState('');
  const [desiredGrade, setDesiredGrade] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [requiredGrade, setRequiredGrade] = useState(null);

  const handleAssignmentChange = (index, field, value) => {
    const newAssignments = [...assignments];
    newAssignments[index][field] = value;
    setAssignments(newAssignments);
    setError(null);
    setFinalGrade(null);
  };

  const addAssignment = () => {
    setAssignments([...assignments, { name: '', grade: '', weight: '' }]);
  };

  const removeAssignment = (index) => {
    const newAssignments = assignments.filter((_, i) => i !== index);
    setAssignments(newAssignments);
  };

  const convertLetterToNumber = (grade) => {
    const letterGrades = {
      'A+': 97, 'A': 95, 'A-': 92,
      'B+': 87, 'B': 85, 'B-': 82,
      'C+': 77, 'C': 75, 'C-': 72,
      'D+': 67, 'D': 65, 'D-': 62,
      'F': 55
    };
    return letterGrades[grade.toUpperCase()] || parseFloat(grade);
  };

  const calculateWeightedGrade = () => {
    try {
      let totalWeight = 0;
      let weightedSum = 0;

      for (const assignment of assignments) {
        if (!assignment.grade || !assignment.weight) continue;

        const numericGrade = convertLetterToNumber(assignment.grade);
        const weight = parseFloat(assignment.weight);

        if (isNaN(numericGrade) || isNaN(weight)) {
          throw new Error('Invalid grade or weight value');
        }

        if (weight < 0 || weight > 100) {
          throw new Error('Weight must be between 0 and 100');
        }

        totalWeight += weight;
        weightedSum += numericGrade * (weight / 100);
      }

      if (totalWeight === 0) {
        throw new Error('Please enter at least one assignment with valid grade and weight');
      }

      if (totalWeight > 100) {
        throw new Error('Total weight cannot exceed 100%');
      }

      setFinalGrade(weightedSum * (100 / totalWeight));
      setError(null);
    } catch (err) {
      setError(err.message);
      setFinalGrade(null);
    }
  };

  const calculateRequiredGrade = () => {
    try {
      const current = parseFloat(currentGrade);
      const desired = parseFloat(desiredGrade);
      const final = parseFloat(finalWeight);

      if (isNaN(current) || isNaN(desired) || isNaN(final)) {
        throw new Error('Please enter valid numerical values');
      }

      if (current < 0 || current > 100 || desired < 0 || desired > 100) {
        throw new Error('Grades must be between 0 and 100');
      }

      if (final <= 0 || final > 100) {
        throw new Error('Final weight must be between 0 and 100');
      }

      const currentWeight = 100 - final;
      const required = (desired - (current * currentWeight / 100)) / (final / 100);

      if (required > 100) {
        setRequiredGrade('Impossible to achieve desired grade');
      } else if (required < 0) {
        setRequiredGrade('Desired grade already achieved');
      } else {
        setRequiredGrade(required.toFixed(2));
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setRequiredGrade(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Helmet>
        <title>Grade Calculator - Calculate Course Grades and Final Requirements</title>
        <meta name="description" content="Calculate weighted course grades and determine required final exam scores to achieve desired grades." />
      </Helmet>

      <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, mb: 3, fontWeight: 600 }}>
        Grade Calculator
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Weighted Grade Calculator */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Weighted Grade Calculator
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Assignment</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Weight (%)</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          size="small"
                          value={assignment.name}
                          onChange={(e) => handleAssignmentChange(index, 'name', e.target.value)}
                          placeholder="Assignment name"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={assignment.grade}
                          onChange={(e) => handleAssignmentChange(index, 'grade', e.target.value)}
                          placeholder="Grade"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={assignment.weight}
                          onChange={(e) => handleAssignmentChange(index, 'weight', e.target.value)}
                          placeholder="Weight"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => removeAssignment(index)}
                          disabled={assignments.length === 1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={addAssignment}
                variant="outlined"
                size="small"
              >
                Add Assignment
              </Button>
              <Button
                variant="contained"
                onClick={calculateWeightedGrade}
                size="small"
              >
                Calculate
              </Button>
            </Box>

            {finalGrade !== null && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary">
                  Final Grade: {finalGrade.toFixed(2)}%
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Column - Final Grade Planning */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, height: '100%', bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Final Grade Planning
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Current Grade (%)"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(e.target.value)}
                size="small"
              />
              <TextField
                label="Desired Final Grade (%)"
                value={desiredGrade}
                onChange={(e) => setDesiredGrade(e.target.value)}
                size="small"
              />
              <TextField
                label="Final Exam Weight (%)"
                value={finalWeight}
                onChange={(e) => setFinalWeight(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={calculateRequiredGrade}
                size="small"
              >
                Calculate Required Grade
              </Button>

              {requiredGrade !== null && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    Required Final Grade: {requiredGrade}
                    {typeof requiredGrade === 'number' && '%'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Grade Calculations">
        <Typography variant="body1">
          The Grade Calculator helps students and educators calculate final grades, required scores for target grades, and weighted averages across different assignments and exams. This tool simplifies academic planning and grade tracking.
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Common Grade Scales:
        </Typography>
        <Typography variant="body1">
          • A: 90-100% - Excellent performance
          • B: 80-89% - Above average performance
          • C: 70-79% - Average performance
          • D: 60-69% - Below average performance
          • F: Below 60% - Failing grade
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Types of Grade Calculations:
        </Typography>
        <Typography variant="body1">
          • Weighted Averages: Different assignments carry different importance
          • Cumulative GPA: Overall academic performance measure
          • Required Scores: Calculate needed grades for target average
          • Final Grade Projections: Estimate end-of-term grades
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Tips for Academic Success:
        </Typography>
        <Typography variant="body1">
          • Track grades consistently throughout the term
          • Understand course weight distributions
          • Set realistic grade goals early
          • Keep detailed records of all assignments
          • Seek help early if struggling
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Important Notes:
        </Typography>
        <Typography variant="body1">
          • Grade scales may vary by institution
          • Some courses may use curve grading
          • Extra credit may affect final grades
          • Always verify calculations with official sources
          • Consider both weighted and unweighted grades
        </Typography>
      </InfoSection>
    </Container>
  );
};

export default GradeCalculator;
