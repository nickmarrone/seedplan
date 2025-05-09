"""Add seeds and tasks

Revision ID: 6fb631bda89e
Revises: 87cd9e6e6e22
Create Date: 2025-05-09 17:22:05.985832+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6fb631bda89e'
down_revision: Union[str, None] = '87cd9e6e6e22'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create seeds table
    op.create_table(
        'seeds',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('plant_type', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('days_to_maturity', sa.Integer(), nullable=False),
        sa.Column('company', sa.String(), nullable=True),
        sa.Column('planting_type', sa.String(), nullable=False),
        sa.Column('weeks_before_frost', sa.Integer(), nullable=True),
        sa.Column('weeks_after_frost', sa.Integer(), nullable=True),
        sa.Column('seed_spacing', sa.Text(), nullable=True),
        sa.Column('seed_notes', sa.Text(), nullable=True),
        sa.Column('color', sa.String(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), onupdate=sa.func.now(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )

    # Create tasks table
    op.create_table(
        'tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('seed_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('task_type', sa.String(), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), onupdate=sa.func.now(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['seed_id'], ['seeds.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('tasks')
    op.drop_table('seeds')
