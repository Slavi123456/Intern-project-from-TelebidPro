BEGIN;

LOCK TABLE unique_words IN EXCLUSIVE MODE;

-- Изтриване на дублиращи се думи
DELETE FROM unique_words WHERE word = ANY(:words_to_delete);

-- Добавяне на новите уникални думи
INSERT INTO unique_words(word) VALUES (:words_to_insert);

COMMIT;

CREATE OR REPLACE FUNCTION toggle_unique_words(words TEXT[])
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM unique_words
    WHERE word = ANY(words);

    INSERT INTO unique_words(word)
    SELECT w
    FROM unnest(words) w
    WHERE NOT EXISTS (
        SELECT 1 FROM unique_words uw WHERE uw.word = w
    );
END;
$$;
