import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Task, Seed } from '../types/garden';

interface TaskDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    seed: Seed;
    task?: Task;
}

const TASK_TYPES = ['bed_prep', 'seed', 'transplant', 'harvest'];

const TaskDialog: React.FC<TaskDialogProps> = ({ open, onClose, onSave, seed, task }) => {
    const [formData, setFormData] = React.useState<Partial<Task>>({
        seed_id: seed.id,
        task_type: 'seed',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        notes: '',
        color: seed.color || '#000000',
        ...task,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleDateChange = (field: 'start_date' | 'end_date') => (date: Date | null) => {
        if (date) {
            setFormData(prev => ({
                ...prev,
                [field]: date.toISOString().split('T')[0]
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{task ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Task Type</InputLabel>
                                <Select
                                    name="task_type"
                                    value={formData.task_type}
                                    onChange={handleChange}
                                    label="Task Type"
                                >
                                    {TASK_TYPES.map(type => (
                                        <MenuItem key={type} value={type}>
                                            {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Start Date"
                                    value={formData.start_date ? new Date(formData.start_date) : null}
                                    onChange={handleDateChange('start_date')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="End Date"
                                    value={formData.end_date ? new Date(formData.end_date) : null}
                                    onChange={handleDateChange('end_date')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            required: true
                                        }
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="notes"
                                label="Notes"
                                value={formData.notes}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {task ? 'Save Changes' : 'Add Task'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskDialog; 