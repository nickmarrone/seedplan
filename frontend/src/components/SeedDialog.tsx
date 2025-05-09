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
    Box,
} from '@mui/material';
import { Seed } from '../types/garden';

interface SeedDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (seed: Partial<Seed>) => void;
    seed?: Seed;
}

const SeedDialog: React.FC<SeedDialogProps> = ({ open, onClose, onSave, seed }) => {
    const [formData, setFormData] = React.useState<Partial<Seed>>({
        plant_type: '',
        name: '',
        days_to_maturity: 0,
        company: '',
        planting_type: 'direct_seed',
        weeks_before_frost: 0,
        weeks_after_frost: 0,
        seed_spacing: '',
        seed_notes: '',
        color: '',
        ...seed,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{seed ? 'Edit Seed' : 'Add New Seed'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="name"
                                label="Seed Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="plant_type"
                                label="Plant Type"
                                value={formData.plant_type}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                name="days_to_maturity"
                                label="Days to Maturity"
                                value={formData.days_to_maturity}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="company"
                                label="Company"
                                value={formData.company}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Planting Type</InputLabel>
                                <Select
                                    name="planting_type"
                                    value={formData.planting_type}
                                    onChange={handleChange}
                                    label="Planting Type"
                                >
                                    <MenuItem value="direct_seed">Direct Seed</MenuItem>
                                    <MenuItem value="transplant">Transplant</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name={formData.planting_type === 'transplant' ? 'weeks_before_frost' : 'weeks_after_frost'}
                                label={formData.planting_type === 'transplant' ? 'Weeks Before Last Frost' : 'Weeks After Last Frost'}
                                value={formData.planting_type === 'transplant' ? formData.weeks_before_frost : formData.weeks_after_frost}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="seed_spacing"
                                label="Seed Spacing"
                                value={formData.seed_spacing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="seed_notes"
                                label="Notes"
                                value={formData.seed_notes}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    name="color"
                                    label="Color"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                                <input
                                    type="color"
                                    value={formData.color || '#000000'}
                                    onChange={(e) => handleChange({
                                        target: {
                                            name: 'color',
                                            value: e.target.value
                                        }
                                    } as any)}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        padding: 0,
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {seed ? 'Save Changes' : 'Add Seed'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SeedDialog; 