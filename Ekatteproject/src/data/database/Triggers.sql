CREATE OR REPLACE TRIGGER TRIG_BEFROE_INSERT_VILLAGES
    BEFORE INSERT OR UPDATE
    ON villages
    FOR EACH ROW
EXECUTE FUNCTION F_VALIDATE_VILLAGE_TOWNSHIP_ID();

CREATE OR REPLACE FUNCTION F_VALIDATE_VILLAGE_TOWNSHIP_ID()
    RETURNS trigger AS
$$
BEGIN
    IF NOT EXISTS (SELECT 1
                   FROM township
                   WHERE id = NEW.township_id
                      OR center_id = NEW.township_id) THEN
        RAISE EXCEPTION
            'Invalid township_id: %',
            NEW.township_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

