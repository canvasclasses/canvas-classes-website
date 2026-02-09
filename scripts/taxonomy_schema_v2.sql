
-- Add sequence_order and class_level to taxonomy table

ALTER TABLE public.taxonomy 
ADD COLUMN IF NOT EXISTS sequence_order INTEGER DEFAULT 9999,
ADD COLUMN IF NOT EXISTS class_level TEXT CHECK (class_level IN ('11', '12'));

-- Optional: Create an index for faster sorting
CREATE INDEX IF NOT EXISTS idx_taxonomy_sequence_order ON public.taxonomy(sequence_order);
