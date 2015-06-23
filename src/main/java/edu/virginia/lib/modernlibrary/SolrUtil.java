package edu.virginia.lib.modernlibrary;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.methods.multipart.ByteArrayPartSource;
import org.apache.commons.httpclient.methods.multipart.FilePart;
import org.apache.commons.httpclient.methods.multipart.MultipartRequestEntity;
import org.apache.commons.httpclient.methods.multipart.Part;
import org.apache.commons.io.IOUtils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by md5wz on 6/23/15.
 */
public class SolrUtil {

    public static void postSolrDoc(File doc, String updateUrl) throws IOException {
        FileInputStream is = new FileInputStream(doc);
        try {
            postSolrDoc(is, updateUrl);
        } finally {
            is.close();
        }
    }

    public static void postSolrDoc(InputStream content, String updateUrl) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        IOUtils.copy(content, baos);
        content.close();
        PostMethod post = new PostMethod(updateUrl);
        Part[] parts = {
                new FilePart("add.xml", new ByteArrayPartSource("add.xml", baos.toByteArray()), "text/xml", "UTF-8")
        };
        post.setRequestEntity(
                new MultipartRequestEntity(parts, post.getParams())
        );
        try {
            new HttpClient().executeMethod(post);
            int status = post.getStatusCode();
            if (status != HttpStatus.SC_OK) {
                throw new RuntimeException("REST action \"" + updateUrl + "\" failed: " + post.getStatusLine());
            }
        } finally {
            post.releaseConnection();
        }
    }

    public static void commit(String updateUrl) throws IOException {
        String url = updateUrl + "?stream.body=%3Ccommit/%3E";
        GetMethod get = new GetMethod(url);
        try {
            HttpClient client = new HttpClient();
            client.executeMethod(get);
            int status = get.getStatusCode();
            if (status != HttpStatus.SC_OK) {
                throw new RuntimeException("REST action \"" + url + "\" failed: " + get.getStatusLine());
            }
        } finally {
            get.releaseConnection();
        }
    }
}
