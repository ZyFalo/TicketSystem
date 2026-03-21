"""add_roles_and_assignments

Revision ID: 406c0e51f0b6
Revises: 44dad21580d5
Create Date: 2026-03-21 13:05:25.747852

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '406c0e51f0b6'
down_revision: Union[str, Sequence[str], None] = '44dad21580d5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Agregar campo rol a usuarios
    op.add_column('usuarios', sa.Column('rol', sa.String(), nullable=False, server_default='developer'))

    # Crear tabla ticket_asignaciones
    op.create_table(
        'ticket_asignaciones',
        sa.Column('ticket_id', sa.Integer(), sa.ForeignKey('tickets.id'), primary_key=True),
        sa.Column('usuario_id', sa.Integer(), sa.ForeignKey('usuarios.id'), primary_key=True),
        sa.Column('assigned_at', sa.DateTime(), nullable=False),
    )

    # Crear tabla asignacion_historial
    op.create_table(
        'asignacion_historial',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('ticket_id', sa.Integer(), sa.ForeignKey('tickets.id'), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('usuario_ids', sa.String(), nullable=False, server_default=''),
        sa.Column('usuario_nombres', sa.String(), nullable=False, server_default=''),
    )

    # Migrar datos de asignado_a a ticket_asignaciones
    conn = op.get_bind()
    results = conn.execute(sa.text("SELECT id, asignado_a FROM tickets WHERE asignado_a IS NOT NULL"))
    for row in results:
        conn.execute(
            sa.text("INSERT INTO ticket_asignaciones (ticket_id, usuario_id, assigned_at) VALUES (:tid, :uid, NOW())"),
            {"tid": row[0], "uid": row[1]},
        )

    # Eliminar columna asignado_a
    op.drop_constraint('tickets_asignado_a_fkey', 'tickets', type_='foreignkey')
    op.drop_column('tickets', 'asignado_a')


def downgrade() -> None:
    op.add_column('tickets', sa.Column('asignado_a', sa.Integer(), nullable=True))
    op.create_foreign_key('tickets_asignado_a_fkey', 'tickets', 'usuarios', ['asignado_a'], ['id'])
    op.drop_table('asignacion_historial')
    op.drop_table('ticket_asignaciones')
    op.drop_column('usuarios', 'rol')
