<?php
namespace Drupal\drupal_module_loader\EventSubscriber;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class DrupalModuleLoaderSubscriber implements EventSubscriberInterface {
  public static function getSubscribedEvents() {
    return [KernelEvents::RESPONSE => ['onResponse', -10]];
  }

  public function onResponse(ResponseEvent $event) {
    \Drupal::logger('drupal_module_loader')->notice('onResponse triggered');
    $response = $event->getResponse();
    $html = $response->getContent();
    \Drupal::logger('drupal_module_loader')->notice('Response HTML: ' . substr($html, 0, 500)); // Log the first 500 characters of the HTML

    // Process the HTML to find custom element tags.
    preg_match_all('/<([a-z0-9\-]+)(\s+[^>]*)?>/i', $html, $matches);
    $found_tags = $matches[1];

    // Store the found tags in a global variable or a service.
    \Drupal::state()->set('drupal_module_loader_found_tags', $found_tags);

    // Log the found tags for debugging.
    \Drupal::logger('drupal_module_loader')->notice('Found Tags: ' . print_r($found_tags, TRUE));
  }
}
?>
