<?php
namespace Wyatts97\UserStories\Controller;

use Flarum\Http\RequestUtil;
use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Support\Arr;
use Wyatts97\UserStories\Serializer\BannerUploadSerializer;
use Laminas\Diactoros\UploadedFile;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class BannerUploadController extends AbstractCreateController
{
    protected $uploadDir;
    protected $settings;
    public $serializer = BannerUploadSerializer::class;

    public function __construct(SettingsRepositoryInterface $settings, FilesystemFactory $filesystemFactory)
    {
        $this->uploadDir = $filesystemFactory->disk('flarum-assets');
        $this->settings = $settings;
    }

    /**
     * Handle the banner upload request.
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        try {
            $actor = RequestUtil::getActor($request);
            $actor->assertAdmin();

            $uploadedFile = Arr::get($request->getUploadedFiles(), 'storyBanner');

            if (!$uploadedFile instanceof UploadedFile || $uploadedFile->getError() !== UPLOAD_ERR_OK) {
                throw new \Exception('File upload error');
            }

            // File upload validation
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            $mimeType = $uploadedFile->getStream()->getMetadata('mimetype') ?: $uploadedFile->getClientMediaType();
            if (!$mimeType || !in_array($mimeType, $allowedMimeTypes)) {
                throw new \Exception('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
            }

            if ($uploadedFile->getSize() > 5 * 1024 * 1024) {
                throw new \Exception('File too large. Maximum size is 5MB.');
            }

            $originalName = $uploadedFile->getClientFilename();
            $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array($extension, $allowedExtensions)) {
                throw new \Exception('Invalid file extension. Only jpg, jpeg, png, and gif are allowed.');
            }

            // Clean up old banner file if it exists
            $oldPath = $this->settings->get('wyatts97-User-Stories.imagePreview');
            if ($oldPath && $this->uploadDir->exists($oldPath)) {
                $this->uploadDir->delete($oldPath);
            }

            $uniqueName = uniqid('storyBanner_') . '.' . $extension;
            $filePath = "extensions/wyatts97-User-Stories/$uniqueName";
            $stream = $uploadedFile->getStream()->getContents();
            $this->uploadDir->write($filePath, $stream);

            $this->settings->set('wyatts97-User-Stories.imagePreview', $filePath);

            return (object)[
                'id' => uniqid(),
                'path' => $filePath,
                'url' => $filePath,
            ];
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('[UserStories] Banner upload failed: ' . $e->getMessage());
            throw new \Exception('File upload failed: ' . $e->getMessage());
        }
    }
}