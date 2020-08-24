<?php

namespace template;

class StringStorage extends Storage
{
    /**
     * @{inheritdoc}
     */
    public function getContent()
    {
        return $this->template;
    }
}
