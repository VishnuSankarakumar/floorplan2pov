import { Router } from 'express';
import multer from 'multer';
import mime from 'mime';
import { RenderBody } from './types';
import { keyOf, get, set } from './cache';
import { renderFromFloorplan } from './gemini';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

export const api = Router();

api.post('/render', upload.single('floorplan'), async (req, res) => {
  try {
    const parsed = RenderBody.safeParse({
      viewpoint: req.body?.viewpoint,
      style: req.body?.style
    });
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    if (!req.file) return res.status(400).json({ error: 'Floorplan image required' });

    const inputMime = req.file.mimetype || mime.getType(req.file.originalname) || 'image/png';
    const cacheKey = keyOf(`${parsed.data.viewpoint}|${parsed.data.style || ''}`, req.file.buffer);
    const cached = get(cacheKey);
    if (cached) return res.type('image/jpeg').send(cached);

    const { buffer, mimeType } = await renderFromFloorplan({
      viewpoint: parsed.data.viewpoint,
      style: parsed.data.style,
      image: req.file.buffer,
      mimeType: inputMime
    });

    set(cacheKey, buffer);
    res.type(mimeType).send(buffer);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal error' });
  }
});
