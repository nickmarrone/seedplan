import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Box,
    Alert,
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Navigation from './Navigation';
import { Seed, Task } from '../types/garden';
import api from '../utils/axios';
import SeedDialog from './SeedDialog';
import TaskDialog from './TaskDialog';

const locales = {
    'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const Dashboard: React.FC = () => {
    const [seeds, setSeeds] = useState<Seed[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedSeed, setSelectedSeed] = useState<Seed | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isSeedDialogOpen, setIsSeedDialogOpen] = useState(false);
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        fetchSeeds();
        fetchTasks();
    }, []);

    const fetchSeeds = async () => {
        try {
            const response = await api.get<Seed[]>('/seeds');
            setSeeds(response.data);
        } catch (error) {
            setError('Error fetching seeds');
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await api.get<Task[]>('/tasks');
            setTasks(response.data);
        } catch (error) {
            setError('Error fetching tasks');
        }
    };

    const handleAddSeed = () => {
        setSelectedSeed(null);
        setIsSeedDialogOpen(true);
    };

    const handleEditSeed = (seed: Seed) => {
        setSelectedSeed(seed);
        setIsSeedDialogOpen(true);
    };

    const handleAddTask = (seed: Seed) => {
        setSelectedSeed(seed);
        setSelectedTask(null);
        setIsTaskDialogOpen(true);
    };

    const handleSaveSeed = async (seedData: Partial<Seed>) => {
        try {
            if (selectedSeed) {
                await api.put(`/seeds/${selectedSeed.id}`, seedData);
                setSuccess('Seed updated successfully');
            } else {
                await api.post('/seeds', seedData);
                setSuccess('Seed added successfully');
            }
            fetchSeeds();
            setIsSeedDialogOpen(false);
        } catch (error) {
            setError('Error saving seed');
        }
    };

    const handleSaveTask = async (taskData: Partial<Task>) => {
        try {
            if (selectedTask) {
                await api.put(`/tasks/${selectedTask.id}`, taskData);
                setSuccess('Task updated successfully');
            } else {
                await api.post('/tasks', taskData);
                setSuccess('Task added successfully');
            }
            fetchTasks();
            setIsTaskDialogOpen(false);
        } catch (error) {
            setError('Error saving task');
        }
    };

    const calendarEvents = tasks.map(task => ({
        id: task.id,
        title: `${task.task_type} - ${seeds.find(s => s.id === task.seed_id)?.name || 'Unknown Seed'}`,
        start: new Date(task.start_date),
        end: new Date(task.end_date),
    }));

    return (
        <>
            <Navigation />
            <Container maxWidth="xl">
                <Box sx={{ mt: 4, mb: 4 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <Grid container spacing={3}>
                        {/* Calendar View */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 200px)' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h5">Garden Calendar</Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddSeed}
                                    >
                                        Add Seed
                                    </Button>
                                </Box>
                                <Calendar
                                    localizer={localizer}
                                    events={calendarEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: 'calc(100% - 50px)' }}
                                />
                            </Paper>
                        </Grid>

                        {/* Seed List */}
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                                <Typography variant="h5" sx={{ mb: 2 }}>My Seeds</Typography>
                                <List>
                                    {seeds.map((seed) => (
                                        <ListItem
                                            key={seed.id}
                                            secondaryAction={
                                                <Box>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="edit"
                                                        onClick={() => handleEditSeed(seed)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleAddTask(seed)}
                                                    >
                                                        Add Task
                                                    </Button>
                                                </Box>
                                            }
                                        >
                                            <ListItemText
                                                primary={seed.name}
                                                secondary={`${seed.plant_type} - ${seed.days_to_maturity} days`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Container>

            {/* Dialogs */}
            <SeedDialog
                open={isSeedDialogOpen}
                onClose={() => setIsSeedDialogOpen(false)}
                onSave={handleSaveSeed}
                seed={selectedSeed || undefined}
            />
            {selectedSeed && (
                <TaskDialog
                    open={isTaskDialogOpen}
                    onClose={() => setIsTaskDialogOpen(false)}
                    onSave={handleSaveTask}
                    seed={selectedSeed}
                    task={selectedTask || undefined}
                />
            )}
        </>
    );
};

export default Dashboard; 