<?php

namespace template;

class FileStorage extends Storage
{
    /**
     * @{inheritdoc}
     */
    public function getContent()
    {
        return file_get_contents($this->template);
    }
}
