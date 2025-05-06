DO $$ 
DECLARE
    obj_name text;
    _schemaname CONSTANT VARCHAR(7) := 'public';
BEGIN
    -- Drop all tables in the public schema
    FOR obj_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = _schemaname
    LOOP
        -- Generate and execute the DROP TABLE statement
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', obj_name);
    END LOOP;

    -- Drop all views in the public schema
    FOR obj_name IN
        SELECT viewname
        FROM pg_views
        WHERE schemaname = _schemaname
    LOOP
        -- Generate and execute the DROP VIEW statement
        EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', obj_name);
    END LOOP;

    -- Drop all ENUM types in the public schema
    FOR obj_name IN
        SELECT typname
        FROM pg_type
        WHERE typnamespace = _schemaname::regnamespace
          AND typtype = 'e' -- Drop only ENUM types
    LOOP
        -- Generate and execute the DROP TYPE statement
        EXECUTE format('DROP TYPE IF EXISTS public.%I CASCADE', obj_name);
    END LOOP;
END $$;
