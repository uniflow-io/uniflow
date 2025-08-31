<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Tag;

use function in_array;
use function is_string;
use function strlen;

class AppService
{
    public function truncateHtml($html, $length = 100, $ending = '...')
    {
        if (!is_string($html)) {
            trigger_error("Function 'truncate_html' expects argument 1 to be an string", E_USER_ERROR);

            return false;
        }

        if (mb_strlen(strip_tags($html)) <= $length) {
            return $html;
        }

        $total = mb_strlen((string) $ending);
        $open_tags = [];
        $return = '';
        $finished = false;
        $final_segment = '';
        $self_closing_elements = [
            'area',
            'base',
            'br',
            'col',
            'frame',
            'hr',
            'img',
            'input',
            'link',
            'meta',
            'param',
        ];
        $inline_containers = [
            'a',
            'b',
            'abbr',
            'cite',
            'em',
            'i',
            'kbd',
            'span',
            'strong',
            'sub',
            'sup',
        ];
        while (!$finished) {
            if (preg_match('/^<(\w+)[^>]*>/', $html, $matches)) { // Does the remaining string start in an opening tag?
                // If not self-closing, place tag in $open_tags array:
                if (!in_array($matches[1], $self_closing_elements, true)) {
                    $open_tags[] = $matches[1];
                }

                // Remove tag from $html:
                $html = substr_replace($html, '', 0, strlen($matches[0]));
                // Add tag to $return:
                $return .= $matches[0];
            } elseif (preg_match('/^<\/(\w+)>/', $html, $matches)) { // Does the remaining string start in an end tag?
                // Remove matching opening tag from $open_tags array:
                $key = array_search($matches[1], $open_tags, true);
                if ($key !== false) {
                    unset($open_tags[$key]);
                }

                // Remove tag from $html:
                $html = substr_replace($html, '', 0, strlen($matches[0]));
                // Add tag to $return:
                $return .= $matches[0];
            } elseif (preg_match('/^([^<]+)(<\/?(\w+)[^>]*>)?/', $html, $matches)) {
                // Extract text up to next tag as $segment:
                $segment = $matches[1];
                // Following code taken from https://trac.cakephp.org/browser/tags/1.2.1.8004/cake/libs/view/helpers/text.php?rev=8005.
                // Not 100% sure about it, but assume it deals with utf and html entities/multi-byte characters to get accureate string length.
                $segment_length = mb_strlen((string) preg_replace('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', ' ', $segment));
                // Compare $segment_length + $total to $length:
                if ($segment_length + $total > $length) { // Truncate $segment and set as $final_segment:
                    $remainder = $length - $total;
                    $entities_length = 0;
                    if (preg_match_all('/&[0-9a-z]{2,8};|&#[0-9]{1,7};|&#x[0-9a-f]{1,6};/i', $segment, $entities, PREG_OFFSET_CAPTURE)) {
                        foreach ($entities[0] as $entity) {
                            if ($entity[1] + 1 - $entities_length <= $remainder) {
                                $remainder--;
                                $entities_length += mb_strlen($entity[0]);
                            } else {
                                break;
                            }
                        }
                    }

                    // Otherwise truncate $segment and set as $final_segment:
                    $finished = true;
                    $final_segment = mb_substr($segment, 0, $remainder + $entities_length);
                } else {
                    // Add $segment to $return and increase $total:
                    $return .= $segment;
                    $total += $segment_length;
                    // Remove $segment from $html:
                    $html = substr_replace($html, '', 0, strlen($segment));
                }
            } else {
                $finshed = true;
            }
        }

        // Check for spaces in $final_segment:
        if (!str_contains($final_segment, ' ') && preg_match('/<(\w+)[^>]*>$/', $return)) { // If none and $return ends in an opening tag: (we ignore $final_segment)
            // Remove opening tag from end of $return:
            $return = preg_replace('/<(\w+)[^>]*>$/', '', $return);
            // Remove opening tag from $open_tags:
            $key = array_search($matches[3], $open_tags, true);
            if ($key !== false) {
                unset($open_tags[$key]);
            }
        } else { // Otherwise, truncate $final_segment to last space and add to $return:
            // $spacepos = strrpos($final_segment, ' ');
            $return .= mb_substr($final_segment, 0, mb_strrpos($final_segment, ' '));
        }

        $return = trim((string) $return);
        $len = strlen($return);
        $last_char = substr($return, $len - 1, 1);
        if (!preg_match('/[a-zA-Z0-9]/', $last_char)) {
            $return = substr_replace($return, '', $len - 1, 1);
        }

        // Add closing tags:
        $closing_tags = array_reverse($open_tags);
        $ending_added = false;
        foreach ($closing_tags as $tag) {
            if (!in_array($tag, $inline_containers, true) && !$ending_added) {
                $return .= $ending;
                $ending_added = true;
            }

            $return .= '</' . $tag . '>';
        }

        return $return;
    }
}
