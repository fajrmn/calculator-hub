import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Helmet } from 'react-helmet-async';
import InfoSection from '../components/InfoSection';

const grades = {
  'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0
};

const GPACalculator = () => {
  const [courses, setCourses] = useState([
    { name: '', credits: '', grade: '' }
  ]);
  const [gpaResult, setGPAResult] = useState(null);
  
  // GPA Planning Calculator state
  const [currentGPA, setCurrentGPA] = useState('');
  const [targetGPA, setTargetGPA] = useState('');
  const [currentCredits, setCurrentCredits] = useState('');
  const [additionalCredits, setAdditionalCredits] = useState('');
  const [planningResult, setPlanningResult] = useState(null);

  const addCourse = () => {
    setCourses([...courses, { name: '', credits: '', grade: '' }]);
  };

  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.credits && course.grade && grades[course.grade]) {
        totalPoints += parseFloat(course.credits) * grades[course.grade];
        totalCredits += parseFloat(course.credits);
      }
    });

    if (totalCredits > 0) {
      setGPAResult({
        gpa: (totalPoints / totalCredits).toFixed(2),
        totalCredits,
        totalPoints: totalPoints.toFixed(2)
      });
    }
  };

  const calculateRequiredGPA = () => {
    if (!currentGPA || !targetGPA || !currentCredits || !additionalCredits) {
      return;
    }

    const current = parseFloat(currentGPA);
    const target = parseFloat(targetGPA);
    const currCredits = parseFloat(currentCredits);
    const addCredits = parseFloat(additionalCredits);
    
    const requiredPoints = (target * (currCredits + addCredits)) - (current * currCredits);
    const requiredGPA = requiredPoints / addCredits;

    setPlanningResult({
      requiredGPA: requiredGPA.toFixed(2),
      totalCredits: (currCredits + addCredits).toFixed(1),
      feasible: requiredGPA <= 4.0 && requiredGPA >= 0
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Helmet>
        <title>GPA Calculator - Calculator Hub</title>
        <meta name="description" content="Calculate your GPA and plan your academic goals with our comprehensive GPA calculator." />
      </Helmet>

      <Grid container spacing={3}>
        {/* Left Column - GPA Calculator */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>GPA Calculator</Typography>
            
            {courses.map((course, index) => (
              <Box key={index} sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <TextField
                  label="Course Name"
                  value={course.name}
                  onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                  size="small"
                  sx={{ flex: 2 }}
                />
                <TextField
                  label="Credits"
                  type="number"
                  value={course.credits}
                  onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Select
                  value={course.grade}
                  onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                  size="small"
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="">Grade</MenuItem>
                  {Object.keys(grades).map(grade => (
                    <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                  ))}
                </Select>
                <IconButton onClick={() => removeCourse(index)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button startIcon={<AddIcon />} onClick={addCourse} sx={{ mt: 1 }}>
              Add Course
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={calculateGPA}
              sx={{ mt: 2, display: 'block' }}
            >
              Calculate GPA
            </Button>
          </Paper>

          {/* GPA Calculator Results */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>GPA Results</Typography>
            {gpaResult && (
              <>
                <Typography variant="h4" color="primary" gutterBottom>
                  {gpaResult.gpa}
                </Typography>
                <Typography variant="body1">
                  Total Credits: {gpaResult.totalCredits}
                </Typography>
                <Typography variant="body1">
                  Total Grade Points: {gpaResult.totalPoints}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Right Column - GPA Planning Calculator */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>GPA Planning Calculator</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current GPA"
                  type="number"
                  value={currentGPA}
                  onChange={(e) => setCurrentGPA(e.target.value)}
                  inputProps={{ step: "0.01", min: "0", max: "4" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target GPA"
                  type="number"
                  value={targetGPA}
                  onChange={(e) => setTargetGPA(e.target.value)}
                  inputProps={{ step: "0.01", min: "0", max: "4" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Credits"
                  type="number"
                  value={currentCredits}
                  onChange={(e) => setCurrentCredits(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Credits Planned"
                  type="number"
                  value={additionalCredits}
                  onChange={(e) => setAdditionalCredits(e.target.value)}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              onClick={calculateRequiredGPA}
              sx={{ mt: 2 }}
            >
              Calculate Required GPA
            </Button>
          </Paper>

          {/* GPA Planning Results */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Planning Results</Typography>
            {planningResult && (
              <>
                <Typography variant="h4" color={planningResult.feasible ? "primary" : "error"} gutterBottom>
                  {planningResult.requiredGPA}
                </Typography>
                <Typography variant="body1">
                  Required GPA for remaining credits
                </Typography>
                <Typography variant="body1">
                  Total Credits after completion: {planningResult.totalCredits}
                </Typography>
                {!planningResult.feasible && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    This GPA target is not achievable with the given credits.
                    Consider adjusting your target or taking more credits.
                  </Typography>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <InfoSection title="Understanding Grade Calculations" sx={{ mt: 4 }}>
        <Typography variant="body1" paragraph>
          Understanding how GPA is calculated and planning for academic goals is crucial for academic success.
          Here's what you need to know about GPA calculations and planning:
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          GPA Scale and Points:
        </Typography>
        <Typography variant="body1">
          • A = 4.0 points
          • A- = 3.7 points
          • B+ = 3.3 points
          • B = 3.0 points
          • B- = 2.7 points
          • C+ = 2.3 points
          • C = 2.0 points
          • C- = 1.7 points
          • D+ = 1.3 points
          • D = 1.0 points
          • F = 0.0 points
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          How GPA is Calculated:
        </Typography>
        <Typography variant="body1">
          • Each course grade is converted to grade points
          • Grade points are multiplied by course credits
          • Total grade points are divided by total credits
          • Result is rounded to two decimal places
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          GPA Planning Strategies:
        </Typography>
        <Typography variant="body1">
          • Set realistic GPA goals based on current standing
          • Consider course difficulty when planning
          • Balance challenging courses with manageable ones
          • Calculate required grades for target GPA
          • Monitor progress throughout the semester
        </Typography>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Tips for GPA Improvement:
        </Typography>
        <Typography variant="body1">
          • Focus on courses with higher credit hours
          • Utilize academic resources and tutoring
          • Consider retaking courses if allowed
          • Maintain consistent study habits
          • Seek help early when struggling
        </Typography>
      </InfoSection>
    </Container>
  );
};

export default GPACalculator;
