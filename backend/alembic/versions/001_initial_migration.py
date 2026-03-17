"""Initial migration — all tables

Revision ID: 001_initial
Revises: 
Create Date: 2026-03-08 08:30:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # admin_users
    op.create_table(
        'admin_users',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    op.create_index('ix_admin_users_email', 'admin_users', ['email'])

    # posts
    op.create_table(
        'posts',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), nullable=False),
        sa.Column('summary', sa.Text(), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=True),
        sa.Column('is_published', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index('ix_posts_slug', 'posts', ['slug'])

    # post_references
    op.create_table(
        'post_references',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('post_id', sa.String(36), nullable=False),
        sa.Column('platform', sa.String(50), nullable=False),
        sa.Column('external_link', sa.Text(), nullable=False),
        sa.Column('label', sa.String(255), nullable=True),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_post_references_post_id', 'post_references', ['post_id'])

    # skill_categories
    op.create_table(
        'skill_categories',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
    )

    # skills
    op.create_table(
        'skills',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('category_id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.ForeignKeyConstraint(['category_id'], ['skill_categories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_skills_category_id', 'skills', ['category_id'])

    # experience
    op.create_table(
        'experience',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('company', sa.String(255), nullable=False),
        sa.Column('role', sa.String(255), nullable=False),
        sa.Column('duration', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('achievements', sa.JSON(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
    )

    # nav_items
    op.create_table(
        'nav_items',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('label', sa.String(100), nullable=False),
        sa.Column('route', sa.String(255), nullable=False),
        sa.Column('is_visible', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.PrimaryKeyConstraint('id'),
    )

    # site_settings
    op.create_table(
        'site_settings',
        sa.Column('key', sa.String(100), nullable=False),
        sa.Column('value', sa.Text(), nullable=True),
        sa.Column('value_type', sa.String(20), nullable=False, server_default='text'),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('key'),
    )

    # contact_messages
    op.create_table(
        'contact_messages',
        sa.Column('id', sa.String(36), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('contact_messages')
    op.drop_table('site_settings')
    op.drop_table('nav_items')
    op.drop_table('experience')
    op.drop_index('ix_skills_category_id', table_name='skills')
    op.drop_table('skills')
    op.drop_table('skill_categories')
    op.drop_index('ix_post_references_post_id', table_name='post_references')
    op.drop_table('post_references')
    op.drop_index('ix_posts_slug', table_name='posts')
    op.drop_table('posts')
    op.drop_index('ix_admin_users_email', table_name='admin_users')
    op.drop_table('admin_users')
